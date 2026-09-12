// Verifie l'etat des services declares par les projets deja collectes, et met
// a jour data/projects.json — sans toucher a l'API GitHub.
//
// Utile pour deux raisons : les services tombent bien plus souvent que les
// metadonnees d'un depot ne changent, et cette verification ne consomme aucun
// quota. Elle peut donc tourner beaucoup plus souvent que la collecte complete.

import fs from "node:fs/promises";
import path from "node:path";

import { checkUrls, isThirdParty } from "./lib/health.mjs";

const OUT = path.resolve(import.meta.dirname, "..", "data", "projects.json");

export function attachHealth(projects, health) {
  let changed = 0;

  for (const project of projects) {
    const checked = Object.values(project.links || {})
      .filter((u) => u && !isThirdParty(u))
      .map((u) => ({ url: u, ...(health[u] || {}) }))
      .filter((r) => r.status !== undefined);

    if (!checked.length) continue;

    const before = project.service?.up;
    project.service = {
      // Un projet est considere joignable des qu'une de ses URLs repond.
      up: checked.some((r) => r.up),
      uncertain: checked.every((r) => r.uncertain === true),
      lastSeenUp: checked.map((r) => r.lastSeenUp).filter(Boolean).sort().pop() || null,
      urls: Object.fromEntries(checked.map((r) => [r.url, r.up])),
    };
    if (before !== project.service.up) changed++;
  }

  return changed;
}

export function previousHealth(projects) {
  const map = {};
  for (const p of projects) {
    if (!p.service?.lastSeenUp) continue;
    for (const url of Object.keys(p.service.urls || {})) {
      map[url] = { lastSeenUp: p.service.lastSeenUp };
    }
  }
  return map;
}

async function main() {
  const data = JSON.parse(await fs.readFile(OUT, "utf8"));
  const urls = data.projects.flatMap((p) => Object.values(p.links || {}));

  const health = await checkUrls(urls, previousHealth(data.projects));
  const changed = attachHealth(data.projects, health);

  data.healthChecked = new Date().toISOString();
  await fs.writeFile(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");

  const online = data.projects.filter((p) => p.service?.up);
  const offline = data.projects.filter((p) => p.service && !p.service.up);

  console.log(`${online.length} service(s) en ligne, ${offline.length} hors ligne`);
  for (const p of offline) {
    const dead = Object.entries(p.service.urls).filter(([, up]) => !up).map(([u]) => u);
    console.log(`  hors ligne — ${p.title} : ${dead.join(", ")}`);
  }
  if (changed) console.log(`${changed} changement(s) d'état depuis la dernière vérification.`);
}

// Ne s'execute que lance directement : collect.mjs importe les helpers ci-dessus.
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((err) => {
    console.error(`Echec de la verification : ${err.message}`);
    process.exit(1);
  });
}
