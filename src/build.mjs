// Assemble dist/ a partir de data/profile.yml et data/projects.json.
// Aucune requete reseau ici : le build est reproductible et fonctionne hors ligne.

import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

import {
  esc,
  layout,
  linkIsDead,
  markdown,
  projectRow,
  statusLabel,
  thumbnail,
} from "./lib/render.mjs";
import { formatDate, labelType } from "./lib/normalize.mjs";
import { techBreakdown, techColor } from "./lib/colors.mjs";
import { formatLongDate, loadNotes } from "./lib/notes.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "data");
const DIST = path.join(ROOT, "dist");
const ASSETS = path.join(ROOT, "src", "assets");

// Une fiche dediee n'a de sens que si le contenu depasse ce que l'index montre deja.
const DETAIL_MIN_CHARS = 400;

const attr = (s) => esc(s).replace(/'/g, "&#39;");

// --- Fragments ---------------------------------------------------------------

// Chiffres tires des projets eux-memes : rien n'est saisi a la main, donc rien
// ne peut devenir faux avec le temps.
function keyFigures(projects) {
  const inProd = projects.filter((p) => p.status === "prod").length;
  const released = projects.filter((p) => p.version).length;
  const years = projects
    .map((p) => parseInt(String(p.started || "").slice(0, 4), 10))
    .filter((y) => y > 2000);
  const since = years.length ? Math.min(...years) : null;

  return [
    { value: projects.length, label: projects.length > 1 ? "projets" : "projet" },
    inProd ? { value: inProd, label: "en production" } : null,
    released ? { value: released, label: "versions publiées" } : null,
    since ? { value: since, label: "premier projet" } : null,
  ].filter(Boolean);
}

function masthead(profile, projects) {
  const id = profile.identity || {};

  const links = [];
  if (id.email) links.push(`<a class="btn" href="mailto:${attr(id.email)}">${esc(id.email)}</a>`);
  if (id.github)
    links.push(
      `<a class="btn" href="https://github.com/${attr(id.github)}" target="_blank" rel="noopener noreferrer">github</a>`
    );
  if (id.linkedin)
    links.push(`<a class="btn" href="${attr(id.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin</a>`);
  if (id.cv) links.push(`<a class="btn" href="${attr(id.cv)}">cv (pdf)</a>`);
  links.push(`<button class="btn" id="theme-toggle" type="button">thème sombre</button>`);

  const avatar = profile.__avatar
    ? `<img class="avatar" src="${attr(profile.__avatar)}" width="72" height="72"
         alt="Portrait de ${attr(id.name || "")}" fetchpriority="high" decoding="async">`
    : "";

  const figures = keyFigures(projects)
    .map(
      (f) => `<div><b>${esc(String(f.value))}</b><span>${esc(f.label)}</span></div>`
    )
    .join("");

  const facts = (profile.facts || [])
    .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
    .join("");

  const clean = (v) => String(v || "").replace(/\s*\n\s*/g, " ").trim();

  return `
<header class="masthead wrap">
  <div class="identity">
    ${avatar}
    <div>
      <h1>${esc(id.name || "")}</h1>
      <p class="role">${esc(id.role || "")}</p>
      <p class="meta">${esc(id.location || "")}</p>
    </div>
  </div>

  ${profile.headline ? `<p class="headline">${esc(clean(profile.headline))}</p>` : ""}
  ${profile.subline ? `<p class="subline">${esc(clean(profile.subline))}</p>` : ""}

  ${figures ? `<div class="figures">${figures}</div>` : ""}
  ${facts ? `<dl class="facts about">${facts}</dl>` : ""}

  <div class="actions">${links.join("")}</div>
</header>`;
}

// Repartition reelle des technologies sur l'ensemble des projets. La barre est
// calculee, pas choisie : elle dit ce sur quoi le travail a porte.
function techBar(projects) {
  const slices = techBreakdown(projects);
  if (slices.length < 3) return "";

  const bar = slices
    .map(
      (s) =>
        `<span class="slice" style="width:${s.percent.toFixed(2)}%;background:${s.color}" title="${attr(
          s.name
        )}"></span>`
    )
    .join("");

  const legend = slices
    .map(
      (s) =>
        `<span class="tech"><i style="background:${s.color}"></i>${esc(s.name)} <b>${Math.round(
          s.percent
        )}%</b></span>`
    )
    .join("");

  return `
  <div class="techbar">
    <div class="bar" role="img" aria-label="Repartition des technologies : ${attr(
      slices.map((s) => `${s.name} ${Math.round(s.percent)}%`).join(", ")
    )}">${bar}</div>
    <div class="legend">${legend}</div>
  </div>`;
}

function filterBar(projects) {
  const statuses = ["prod", "wip", "paused", "archived"].filter((s) =>
    projects.some((p) => p.status === s)
  );

  // Une techno ne merite un filtre que si elle revient assez souvent pour
  // que le filtre serve a quelque chose.
  const counts = new Map();
  for (const p of projects) for (const s of p.stack) counts.set(s, (counts.get(s) || 0) + 1);
  const techs = [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([name]) => name);

  const button = (value, label) =>
    `<button class="btn" type="button" data-filter="${attr(value)}" aria-pressed="false">${esc(label)}</button>`;

  return `
  <div class="filters" role="group" aria-label="Filtrer les projets">
    ${statuses.map((s) => button(s, statusLabel(s))).join("")}
    ${techs.map((t) => button(t, t)).join("")}
  </div>`;
}

function projectsSection(profile, projects, detailSlugs) {
  const rows = projects
    .map((p) => projectRow(p, { detailHref: detailSlugs.has(p.key) ? `p/${p.slug}.html` : null }))
    .join("");

  return `
<section id="projets">
  <div class="section-head">
    <h2>Projets</h2>
    <span class="count" id="projects-count">${projects.length} projets</span>
  </div>
  ${filterBar(projects)}
  <ul class="projects" id="projects">${rows}</ul>
  <p class="empty" id="projects-empty" hidden>Aucun projet ne correspond à ce filtre.</p>
</section>`;
}

function notesSection(notes) {
  if (!notes.length) return "";

  const rows = notes
    .map(
      (n) => `
    <li class="note-row">
      <span class="when">${esc(formatLongDate(n.date))}</span>
      <div>
        <h3 class="note-title">
          <a href="n/${attr(n.slug)}.html">${esc(n.title)}</a>
          ${n.draft ? `<span class="status" data-status="wip">brouillon</span>` : ""}
        </h3>
        ${n.summary ? `<p class="note-summary">${esc(n.summary)}</p>` : ""}
        <p class="note-foot">${esc(`${n.minutes} min de lecture`)}${
          n.tags.length ? ` · ${esc(n.tags.join(" · "))}` : ""
        }</p>
      </div>
    </li>`
    )
    .join("");

  return `
<section id="notes">
  <div class="section-head">
    <h2>Notes</h2>
    <span class="count">${notes.length} article${notes.length > 1 ? "s" : ""}</span>
  </div>
  <ul class="notes">${rows}</ul>
</section>`;
}

function experienceSection(profile) {
  const items = profile.experience || [];
  if (!items.length) return "";

  const rows = items
    .map(
      (e) => `
    <li class="entry">
      <span class="when">${esc(formatDate(e.start))} – ${esc(formatDate(e.end) || "présent")}</span>
      <div>
        <div class="what">${esc(e.title)}</div>
        <div class="where">${esc(e.org)}${e.place ? ` · ${esc(e.place)}` : ""}</div>
      </div>
      ${e.summary ? `<p class="note">${esc(String(e.summary).trim())}</p>` : ""}
    </li>`
    )
    .join("");

  return `
<section id="experience">
  <div class="section-head"><h2>Expérience</h2></div>
  <ul class="timeline">${rows}</ul>
</section>`;
}

function educationSection(profile) {
  const items = profile.education || [];
  if (!items.length) return "";

  const rows = items
    .map(
      (e) => `
    <li class="entry">
      <span class="when">${esc(e.start)} – ${esc(e.end)}</span>
      <div>
        <div class="what">${esc(e.degree)}</div>
        <div class="where">${esc(e.school)}${e.place ? ` · ${esc(e.place)}` : ""}</div>
      </div>
    </li>`
    )
    .join("");

  return `
<section id="formation">
  <div class="section-head"><h2>Formation</h2></div>
  <ul class="timeline">${rows}</ul>
</section>`;
}

function skillsSection(profile, projects) {
  const groups = profile.skills || [];
  if (!groups.length) return "";

  const langs = (profile.languages || [])
    .map((l) => `${l.name} (${l.level})`)
    .join(", ");

  const rows = groups
    .map(
      (g) => `
    <div class="skill-row">
      <dt>${esc(g.group)}</dt>
      <dd>${esc((g.items || []).join(", "))}</dd>
    </div>`
    )
    .join("");

  const languages = langs
    ? `<div class="skill-row"><dt>Langues</dt><dd>${esc(langs)}</dd></div>`
    : "";

  return `
<section id="competences">
  <div class="section-head"><h2>Compétences</h2></div>
  ${techBar(projects)}
  <dl class="skills">${rows}${languages}</dl>
</section>`;
}

function footer(profile, generated) {
  const id = profile.identity || {};
  const when = generated
    ? new Date(generated).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return `
<footer class="wrap">
  <span>${esc(id.name || "")}</span>
  ${when ? `<span>mis à jour le ${esc(when)}</span>` : ""}
  ${
    id.repo
      ? `<span class="spacer"><a href="${attr(id.repo)}" target="_blank" rel="noopener noreferrer">source</a></span>`
      : ""
  }
</footer>`;
}

// --- Pages -------------------------------------------------------------------

function indexPage(profile, data, detailSlugs, notes) {
  const seo = profile.seo || {};
  const body = `
${masthead(profile, data.projects)}
<main id="main" class="wrap">
  ${projectsSection(profile, data.projects, detailSlugs)}
  ${notesSection(notes)}
  ${experienceSection(profile)}
  ${educationSection(profile)}
  ${skillsSection(profile, data.projects)}
</main>
${footer(profile, data.generated)}`;

  return layout({
    title: seo.title || profile.identity?.name || "Portfolio",
    description: seo.description || "",
    url: seo.url,
    canonical: seo.url,
    body,
  });
}

function detailPage(profile, project) {
  const seo = profile.seo || {};
  const base = project.links?.repo ? `${project.links.repo}/raw/HEAD` : null;

  // L'etat du service est une information distincte du statut du code : un
  // projet fige peut tourner encore, un projet actif n'etre deploye nulle part.
  const service = project.service
    ? project.service.up
      ? "en ligne"
      : project.service.lastSeenUp
        ? `hors ligne (vu le ${formatDate(project.service.lastSeenUp)})`
        : "hors ligne"
    : "";

  const facts = [
    ["Statut", statusLabel(project.status)],
    ["Service", service],
    ["Type", project.type ? labelType(project.type) : ""],
    ["Stack", project.stack.join(", ")],
    ["Version", project.version ? `${project.version}${project.prerelease ? " (pré-release)" : ""}` : ""],
    ["Début", formatDate(project.started)],
    [project.status === "prod" ? "Dernière activité" : "Fin", formatDate(project.ended || project.updated)],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");

  const links = Object.entries(project.links || {})
    .filter(([, url]) => url && !linkIsDead(project, url))
    .map(
      ([key, url]) =>
        `<a class="btn" href="${attr(url)}" target="_blank" rel="noopener noreferrer">${esc(
          { repo: "voir le code", demo: "voir le site", docs: "documentation" }[key] || key
        )}</a>`
    )
    .join("");

  const aliases = (project.aliases || []).length
    ? `<p class="project-summary">Versions précédentes : ${project.aliases
        .map((a) =>
          a.repo
            ? `<a href="${attr(a.repo)}" target="_blank" rel="noopener noreferrer">${esc(a.title)}</a>`
            : esc(a.title)
        )
        .join(", ")}.</p>`
    : "";

  const body = `
<div class="wrap">
  <p class="crumb"><a href="../index.html">← tous les projets</a></p>
  ${
    project.banner
      ? `<div class="banner"><img src="../${attr(project.banner)}" alt="Bannière du projet ${attr(
          project.title
        )}" loading="eager" decoding="async"></div>`
      : ""
  }
  <header class="detail-head">
    <div class="identity">
      ${project.banner ? "" : thumbnail(project, { prefix: "../" })}
      <h1>${esc(project.title)}</h1>
    </div>
    ${project.summary ? `<p class="lede">${esc(project.summary)}</p>` : ""}
    <dl class="facts">${facts}</dl>
    ${links ? `<div class="actions">${links}</div>` : ""}
    ${aliases}
  </header>
  <main id="main" class="prose">${markdown(project.body, { baseUrl: base })}</main>
</div>
${footer(profile, null)}`;

  return layout({
    title: `${project.title} — ${profile.identity?.name || ""}`.trim(),
    description: project.summary || "",
    url: seo.url ? `${seo.url.replace(/\/$/, "")}/p/${project.slug}.html` : "",
    canonical: seo.url ? `${seo.url.replace(/\/$/, "")}/p/${project.slug}.html` : "",
    body,
    assetsPrefix: "../",
  });
}

function notePage(profile, note) {
  const seo = profile.seo || {};
  const base = seo.url ? `${seo.url.replace(/\/$/, "")}/n/${note.slug}.html` : "";

  const body = `
<div class="wrap">
  <p class="crumb"><a href="../index.html">← retour à l'accueil</a></p>
  <header class="detail-head">
    <h1>${esc(note.title)}</h1>
    ${note.summary ? `<p class="lede">${esc(note.summary)}</p>` : ""}
    <p class="note-foot">
      ${esc(formatLongDate(note.date))} · ${esc(`${note.minutes} min de lecture`)}${
        note.tags.length ? ` · ${esc(note.tags.join(" · "))}` : ""
      }
    </p>
  </header>
  <main id="main" class="prose">${markdown(note.body)}</main>
</div>
${footer(profile, null)}`;

  return layout({
    title: `${note.title} — ${profile.identity?.name || ""}`.trim(),
    description: note.summary || "",
    url: base,
    canonical: base,
    body,
    assetsPrefix: "../",
  });
}

// --- Entree ------------------------------------------------------------------

async function main() {
  const profile = YAML.parse(await fs.readFile(path.join(DATA, "profile.yml"), "utf8")) || {};
  const data = JSON.parse(await fs.readFile(path.join(DATA, "projects.json"), "utf8"));

  // Les visuels sont des fichiers deposes dans static/ : aucune requete reseau
  // au build, et un logo s'ajoute en copiant une image au bon nom.
  const exists = async (rel) =>
    fs
      .access(path.join(ROOT, "static", rel))
      .then(() => true)
      .catch(() => false);

  if (await exists("img/avatar.webp")) profile.__avatar = "img/avatar.webp";

  for (const project of data.projects) {
    // Une vignette carree (img/projects/) sert l'index ; une banniere large
    // (img/banners/) coiffe la fiche detaillee. Les deux sont facultatives.
    const thumb = `img/projects/${project.slug}.webp`;
    if (await exists(thumb)) project.thumb = thumb;

    const banner = `img/banners/${project.slug}.webp`;
    if (await exists(banner)) project.banner = banner;
  }

  const notes = await loadNotes(path.join(ROOT, "content", "notes"));

  const withDetail = data.projects.filter((p) => (p.body || "").length >= DETAIL_MIN_CHARS);
  const detailSlugs = new Set(withDetail.map((p) => p.key));

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(path.join(DIST, "p"), { recursive: true });
  if (notes.length) await fs.mkdir(path.join(DIST, "n"), { recursive: true });

  await fs.writeFile(path.join(DIST, "index.html"), indexPage(profile, data, detailSlugs, notes), "utf8");

  for (const project of withDetail) {
    await fs.writeFile(path.join(DIST, "p", `${project.slug}.html`), detailPage(profile, project), "utf8");
  }

  for (const note of notes) {
    await fs.writeFile(path.join(DIST, "n", `${note.slug}.html`), notePage(profile, note), "utf8");
  }

  for (const asset of ["style.css", "app.js"]) {
    await fs.copyFile(path.join(ASSETS, asset), path.join(DIST, asset));
  }

  // Tout le contenu de static/ (CV, images) est publie tel quel.
  try {
    await fs.cp(path.join(ROOT, "static"), DIST, { recursive: true });
  } catch {
    /* pas de dossier static : rien a publier */
  }

  // GitHub Pages sert le site tel quel, sans passer par Jekyll.
  await fs.writeFile(path.join(DIST, ".nojekyll"), "", "utf8");

  const seoUrl = (profile.seo?.url || "").replace(/\/$/, "");
  if (seoUrl) {
    const urls = [
      "",
      ...withDetail.map((p) => `p/${p.slug}.html`),
      ...notes.map((n) => `n/${n.slug}.html`),
    ];
    const sitemap =
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${seoUrl}/${u}</loc></url>`).join("\n") +
      `\n</urlset>\n`;
    await fs.writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
    await fs.writeFile(
      path.join(DIST, "robots.txt"),
      `User-agent: *\nAllow: /\nSitemap: ${seoUrl}/sitemap.xml\n`,
      "utf8"
    );
  }

  const sizes = await Promise.all(
    ["index.html", "style.css", "app.js"].map(async (f) => {
      const { size } = await fs.stat(path.join(DIST, f));
      return `${f} ${(size / 1024).toFixed(1)} ko`;
    })
  );

  console.log(
    `dist/ construit — ${data.projects.length} projets, ${withDetail.length} fiches détaillées` +
      (notes.length ? `, ${notes.length} notes` : "")
  );
  console.log("  " + sizes.join("  ·  "));
}

main().catch((err) => {
  console.error(`Echec du build : ${err.message}`);
  process.exit(1);
});
