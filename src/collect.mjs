// Collecte les projets depuis GitHub et PocketBase, fusionne les doublons,
// puis ecrit data/projects.json. Ce fichier est commite : si une source tombe,
// le build precedent reste publiable.

import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

import * as gh from "./lib/gh.mjs";
import { fetchProjects as fetchPocketbase } from "./lib/pb.mjs";
import { checkUrls } from "./lib/health.mjs";
import * as modrinth from "./lib/modrinth.mjs";
import { attachHealth, previousHealth } from "./health.mjs";
import {
  cleanReadme,
  firstParagraph,
  frontmatter,
  inferStatus,
  knownType,
  stripEmoji,
} from "./lib/normalize.mjs";
import { collapseAliases, matchPocketbase, mergeLayers, sortProjects } from "./lib/merge.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "data");
const OUT = path.join(DATA, "projects.json");

const readYaml = async (file) => YAML.parse(await fs.readFile(path.join(DATA, file), "utf8")) || {};

const log = (...a) => console.log(...a);
const warn = (...a) => console.warn("  ! ", ...a);

// --- GitHub -----------------------------------------------------------------

async function collectGithub(config) {
  const topic = config.topic || "portfolio";
  const exclude = new Set((config.exclude || []).map((s) => s.toLowerCase()));
  const include = new Set((config.include || []).map((s) => s.toLowerCase()));
  const requireContribution = config.requireContribution === true;
  const minCommits = Math.max(1, config.minCommits || 1);
  const identities = new Set(
    (config.identities?.length ? config.identities : config.users || []).map((s) =>
      String(s).toLowerCase()
    )
  );

  const raw = [];
  for (const user of config.users || []) raw.push(...(await gh.listUserRepos(user)));
  for (const org of config.orgs || []) raw.push(...(await gh.listOrgRepos(org)));

  const uniq = new Map();
  for (const r of raw) if (!uniq.has(r.full_name.toLowerCase())) uniq.set(r.full_name.toLowerCase(), r);

  const candidates = [...uniq.values()].filter((r) => !exclude.has(r.full_name.toLowerCase()));
  log(`  ${candidates.length} repos candidats`);

  // Le topic et la liste include sont deja connus (gratuit) ; on ne sonde
  // portfolio.md que pour le reste. raw.githubusercontent n'est pas soumis au
  // rate limit de l'API, donc ces sondes ne coutent rien au quota.
  const isTagged = (r) =>
    (r.topics || []).includes(topic) || include.has(r.full_name.toLowerCase());
  const tagged = candidates.filter(isTagged);
  const untagged = candidates.filter((r) => !isTagged(r));

  const probes = await Promise.all(
    untagged.map(async (r) => ({
      repo: r,
      file: await gh.rawFile(r.owner.login, r.name, "portfolio.md"),
    }))
  );

  const selected = [
    ...tagged.map((repo) => ({ repo, file: undefined })),
    ...probes.filter((p) => p.file).map(({ repo, file }) => ({ repo, file })),
  ];

  log(`  ${selected.length} retenus (topic "${topic}", liste include, ou portfolio.md)`);

  const out = new Map();
  for (const { repo, file } of selected) {
    const owner = repo.owner.login;
    const name = repo.name;
    const key = `${owner}/${name}`.toLowerCase();

    // `file === undefined` : repo selectionne par topic, pas encore sonde.
    const portfolioMd = file === undefined ? await gh.rawFile(owner, name, "portfolio.md") : file;
    const readme =
      (await gh.rawFile(owner, name, "README.md")) || (await gh.rawFile(owner, name, "readme.md"));

    const [languages, release, contribs] = await Promise.all([
      gh.repoLanguages(owner, name),
      gh.latestRelease(owner, name),
      gh.contributors(owner, name),
    ]);

    // Part reelle dans le depot. `contribs` vaut null quand GitHub ne peut pas
    // repondre (depot vide, statistiques en cours) : dans ce cas on ne filtre
    // pas, pour ne pas perdre un projet a cause d'une API momentanement muette.
    let contribution = null;
    if (contribs) {
      const mine = contribs.filter((c) => identities.has(c.login));
      const commits = mine.reduce((sum, c) => sum + c.commits, 0);
      const total = contribs.reduce((sum, c) => sum + c.commits, 0);
      const rank = commits ? contribs.findIndex((c) => identities.has(c.login)) + 1 : 0;
      contribution = { commits, total, rank, contributors: contribs.length };

      if (requireContribution && commits < minCommits) {
        log(`    ${key}  — ignore : ${commits} commit(s) de ${[...identities].join("/")}`);
        continue;
      }
    }

    const links = { repo: repo.html_url };
    if (repo.homepage && /^https?:\/\//.test(repo.homepage)) links.demo = repo.homepage;

    out.set(key, {
      key,
      name,
      owner,
      org: owner.toLowerCase() === (config.users?.[0] || "").toLowerCase() ? null : owner,
      description: stripEmoji(repo.description || ""),
      readmeSummary: stripEmoji(firstParagraph(readme)),
      // Le README est une source a normaliser ; un portfolio.md ecrit a la main,
      // lui, est rendu tel quel — son auteur assume ce qu'il y met.
      readmeBody: stripEmoji(cleanReadme(readme)),
      languages,
      release,
      stars: repo.stargazers_count || 0,
      archived: repo.archived,
      created: repo.created_at,
      pushed: repo.pushed_at,
      topics: (repo.topics || []).filter((t) => t !== topic),
      links,
      portfolioMd,
      type: knownType((repo.topics || []).filter((t) => t !== topic)),
      contribution,
      inferred: inferStatus({ archived: repo.archived, pushed: repo.pushed_at, release }),
    });

    log(`    ${key}${portfolioMd ? "  [portfolio.md]" : ""}`);
  }

  return out;
}

// --- Assemblage -------------------------------------------------------------

function buildProjects(githubByKey, pbMatched, pbOrphans, overrides) {
  const projects = [];

  for (const [key, g] of githubByKey) {
    const { data, body } = frontmatter(g.portfolioMd);
    const pmd = { ...data, body: body.trim(), __present: Boolean(g.portfolioMd) };

    // Sans portfolio.md, le README nettoye fournit le corps de la fiche.
    if (!pmd.__present && g.readmeBody) pmd.body = g.readmeBody;

    projects.push(
      mergeLayers({
        gh: g,
        pmd,
        pb: pbMatched.get(key) || null,
        ovr: overrides[key] || null,
      })
    );
  }

  // Projets PocketBase sans repo GitHub collecte (pas de code public, ou repo prive).
  for (const item of pbOrphans) {
    const key = `pb:${(item.slug || item.nom || item.name || item.id || "").toLowerCase()}`;
    const ovr = overrides[key] || overrides[key.slice(3)] || null;
    if (ovr?.hidden) continue;
    const links = {};
    if (item.repository) links.repo = item.repository;
    if (item.url && /^https?:\/\//.test(item.url)) links.demo = item.url;
    projects.push(mergeLayers({ gh: null, pmd: {}, pb: { ...item, key, links }, ovr }));
  }

  return sortProjects(collapseAliases(projects, overrides).filter((p) => !p.hidden));
}

// --- Entree -----------------------------------------------------------------

// L'historique de disponibilite survit d'une collecte a l'autre : sans lui,
// une panne d'une heure suffirait a effacer la derniere reponse connue.
async function readPreviousProjects() {
  try {
    return (JSON.parse(await fs.readFile(OUT, "utf8")).projects) || [];
  } catch {
    return [];
  }
}

async function main() {
  const sources = await readYaml("sources.yml");
  const overridesRaw = await readYaml("overrides.yml");
  const overrides = Object.fromEntries(
    Object.entries(overridesRaw).map(([k, v]) => [String(k).toLowerCase(), v || {}])
  );

  log(`GitHub (token: ${gh.hasToken() ? "oui" : "non"}, quota ${await gh.rateStatus()})`);
  const githubByKey = await collectGithub(sources.github || {});

  let pbMatched = new Map();
  let pbOrphans = [];
  if (sources.pocketbase?.enabled) {
    log("PocketBase");
    try {
      const items = await fetchPocketbase(sources.pocketbase);
      const res = matchPocketbase(items, githubByKey);
      pbMatched = res.matched;
      pbOrphans = res.orphans;
      log(`  ${items.length} fiches — ${pbMatched.size} rapprochees, ${pbOrphans.length} autonomes`);
    } catch (err) {
      warn(`ignoree : ${err.message}`);
    }
  }

  const projects = buildProjects(githubByKey, pbMatched, pbOrphans, overrides);

  // Modrinth : captures d'ecran, icone et telechargements. Ces informations
  // vivent sur la page de publication, jamais dans le depot.
  if (sources.modrinth?.enabled !== false) {
    log("Modrinth");
    let trouves = 0;
    for (const project of projects) {
      const slug = modrinth.findSlug(project);
      if (!slug) continue;
      try {
        const data = await modrinth.fetchProject(slug);
        if (!data) continue;

        project.modrinth = {
          slug: data.slug,
          url: data.url,
          downloads: data.downloads,
          followers: data.followers,
          license: data.license,
        };

        // Une galerie declaree a la main reste prioritaire.
        if (!project.gallery.length && data.gallery.length) {
          project.gallery = data.gallery.map((img) => ({ ...img, source: "modrinth" }));
        }
        // L'icone Modrinth sert de logo quand le projet n'en a pas d'autre.
        if (!project.image && data.icon) project.image = data.icon;

        trouves++;
        log(`    ${project.title} — ${data.gallery.length} image(s), ${data.downloads} telechargements`);
      } catch (err) {
        warn(`${project.title} : ${err.message}`);
      }
    }
    if (!trouves) log("  aucun projet publie sur Modrinth");
  }

  // Etat des services : verifie a chaque collecte, car c'est la seule donnee
  // qu'aucune metadonnee de depot ne peut fournir.
  if (sources.healthcheck?.enabled !== false) {
    log("Services");
    const old = await readPreviousProjects();
    const urls = projects.flatMap((p) => Object.values(p.links || {}));
    const health = await checkUrls(urls, previousHealth(old));
    attachHealth(projects, health);

    const online = projects.filter((p) => p.service?.up).length;
    const offline = projects.filter((p) => p.service && !p.service.up);
    log(`  ${online} en ligne, ${offline.length} hors ligne`);
    for (const p of offline) {
      const dead = Object.entries(p.service.urls).filter(([, up]) => !up).map(([u]) => u);
      warn(`${p.title} hors ligne : ${dead.join(", ")}`);
    }
  }

  if (projects.length === 0) {
    warn("aucun projet collecte — data/projects.json conserve tel quel.");
    process.exitCode = 1;
    return;
  }

  const payload = {
    generated: new Date().toISOString(),
    count: projects.length,
    projects,
  };
  await fs.writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");

  const byStatus = projects.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }), {});
  log(`\n${projects.length} projets ecrits dans data/projects.json`);
  log(Object.entries(byStatus).map(([k, v]) => `  ${k}: ${v}`).join("\n"));

  const thin = projects.filter((p) => !p.summary);
  if (thin.length) warn(`sans resume : ${thin.map((p) => p.key).join(", ")}`);
}

main().catch((err) => {
  console.error(`\nEchec de la collecte : ${err.message}`);
  console.error("data/projects.json est conserve — le build reste possible.");
  process.exit(1);
});
