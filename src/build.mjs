// Assemble dist/ a partir de data/profile.yml et data/projects.json.
// Aucune requete reseau ici : le build est reproductible et fonctionne hors ligne.

import crypto from "node:crypto";
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
<header class="masthead">
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

  // Toutes les technologies presentes, les plus frequentes d'abord. Aucune n'est
  // ecartee : une techno qui n'apparait qu'une fois est justement celle qu'on
  // cherche quand on filtre dessus.
  const counts = new Map();
  for (const p of projects) for (const s of p.stack) counts.set(s, (counts.get(s) || 0) + 1);
  const techs = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
    .map(([name, n]) => ({ name, n }));

  const button = (value, label, count) =>
    `<button class="btn" type="button" data-filter="${attr(value)}" aria-pressed="false">` +
    `${esc(label)}${count ? `<b>${count}</b>` : ""}</button>`;

  return `
  <div class="filters" role="group" aria-label="Filtrer les projets">
    ${statuses
      .map((s) => button(s, statusLabel(s), projects.filter((p) => p.status === s).length))
      .join("")}
    <span class="filters-sep" aria-hidden="true"></span>
    ${techs
      .map(
        (t) =>
          `<button class="btn" type="button" data-filter="${attr(t.name)}" aria-pressed="false">` +
          `<i class="dot" style="background:${techColor(t.name)}"></i>${esc(t.name)}<b>${t.n}</b></button>`
      )
      .join("")}
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

function indexPage(profile, data, detailSlugs, notes, assetVersion) {
  const seo = profile.seo || {};
  // Deux panneaux : le profil a gauche, les projets a droite, chacun avec son
  // propre defilement sur grand ecran. Le panneau de gauche regroupe donc tout
  // le profil — en-tete comprise — pour defiler d'un bloc.
  //
  // Sur telephone la grille disparait et `display: contents` rend les enfants
  // du panneau reordonnables : l'identite reste en tete, les projets suivent
  // immediatement, le parcours ferme la marche.
  const body = `
<div class="layout">
  <aside class="pane pane-side">
    ${masthead(profile, data.projects)}
    ${skillsSection(profile, data.projects)}
    ${experienceSection(profile)}
    ${educationSection(profile)}
    ${footer(profile, data.generated)}
  </aside>

  <main id="main" class="pane pane-main">
    ${projectsSection(profile, data.projects, detailSlugs)}
    ${notesSection(notes)}
  </main>
</div>`;

  return layout({
    title: seo.title || profile.identity?.name || "Portfolio",
    description: seo.description || "",
    url: seo.url,
    canonical: seo.url,
    body,
    assetVersion,
  });
}

function detailPage(profile, project, assetVersion) {
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

  // Part dans le depot, toujours exprimee en proportion : le chiffre brut parle
  // de lui-meme, et le lecteur situe l'implication sans qu'on la qualifie.
  const c = project.contribution;
  const contribution = c?.commits
    ? c.contributors > 1
      ? `${c.commits} commits sur ${c.total}`
      : `${c.commits} commits`
    : "";

  const facts = [
    ["Statut", statusLabel(project.status)],
    ["Service", service],
    ["Contribution", contribution],
    [
      "Téléchargements",
      project.modrinth?.downloads
        ? new Intl.NumberFormat("fr-FR").format(project.modrinth.downloads)
        : "",
    ],
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

  const linkAlias = (a) =>
    a.repo
      ? `<a href="${attr(a.repo)}" target="_blank" rel="noopener noreferrer">${esc(a.title)}</a>`
      : esc(a.title);

  const groupes = [
    {
      items: (project.aliases || []).filter((a) => a.relation !== "successor"),
      label: (n) => (n > 1 ? "Versions précédentes" : "Version précédente"),
    },
    {
      items: (project.aliases || []).filter(
        (a) => a.relation === "successor" && a.status === "wip"
      ),
      label: () => "Réécriture en cours",
    },
    {
      items: (project.aliases || []).filter(
        (a) => a.relation === "successor" && a.status !== "wip"
      ),
      label: () => "Remplacé par",
    },
  ].filter((g) => g.items.length);

  const aliases = groupes.length
    ? `<p class="aliases">${groupes
        .map((g) => `${g.label(g.items.length)} : ${g.items.map(linkAlias).join(", ")}`)
        .join(" · ")}.</p>`
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
  ${gallerySection(project, "../")}
</div>
${footer(profile, null)}`;

  return layout({
    title: `${project.title} — ${profile.identity?.name || ""}`.trim(),
    description: project.summary || "",
    url: seo.url ? `${seo.url.replace(/\/$/, "")}/p/${project.slug}.html` : "",
    canonical: seo.url ? `${seo.url.replace(/\/$/, "")}/p/${project.slug}.html` : "",
    body,
    assetsPrefix: "../",
    assetVersion,
  });
}

// Galerie d'illustrations. Les vignettes sont chargees paresseusement : une
// fiche peut en compter dix, et elles sont sous la ligne de flottaison.
function gallerySection(project, prefix = "") {
  const images = project.gallery || [];
  if (!images.length) return "";

  // Les fiches vivent dans /p/ : un chemin declare relativement a la racine du
  // site doit etre reecrit, alors qu'une URL absolue est laissee intacte.
  const resolve = (url) =>
    /^(https?:)?\/\//.test(url) || url.startsWith("data:") ? url : prefix + url.replace(/^\//, "");

  const items = images
    .map((img, i) => {
      const legende = img.title || img.description || "";
      return `
      <figure class="shot">
        <a href="${attr(resolve(img.full || img.url))}" target="_blank" rel="noopener noreferrer"
           aria-label="${attr(legende || `Image ${i + 1}`)} — ouvrir en pleine résolution">
          <img src="${attr(resolve(img.url))}" alt="${attr(legende)}" loading="lazy" decoding="async">
        </a>
        ${legende ? `<figcaption>${esc(legende)}</figcaption>` : ""}
      </figure>`;
    })
    .join("");

  const origine = project.modrinth
    ? ` <span class="count">via <a href="${attr(project.modrinth.url)}" target="_blank" rel="noopener noreferrer">Modrinth</a></span>`
    : "";

  return `
  <section class="gallery-section">
    <div class="section-head">
      <h2>Aperçu</h2>
      <span class="count">${images.length} image${images.length > 1 ? "s" : ""}${origine}</span>
    </div>
    <div class="gallery">${items}</div>
  </section>`;
}

function notePage(profile, note, assetVersion) {
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
    assetVersion,
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

  // Le nom du fichier suit le slug du projet, mais tiret et tiret bas se
  // confondent facilement au moment de deposer une image : on accepte les deux
  // plutot que d'ignorer silencieusement un logo mal nomme.
  const firstExisting = async (base) => {
    const noms = [...new Set([base, base.replace(/-/g, "_"), base.replace(/_/g, "-")])];
    for (const nom of noms) {
      for (const ext of ["webp", "png", "svg", "jpg", "jpeg"]) {
        if (await exists(`${nom}.${ext}`)) return `${nom}.${ext}`;
      }
    }
    return null;
  };

  profile.__avatar = await firstExisting("img/avatar");

  for (const project of data.projects) {
    // Une vignette carree (img/projects/) sert l'index ; une banniere large
    // (img/banners/) coiffe la fiche detaillee. Les deux sont facultatives.
    // On accepte les formats courants pour qu'un logo puisse etre depose tel
    // quel, sans conversion prealable.
    project.thumb = await firstExisting(`img/projects/${project.slug}`);
    project.banner = await firstExisting(`img/banners/${project.slug}`);
  }

  // Empreinte commune aux deux assets : ils changent presque toujours ensemble,
  // et une seule valeur suffit a invalider les caches des visiteurs.
  const assetVersion = crypto
    .createHash("sha1")
    .update(await fs.readFile(path.join(ASSETS, "style.css")))
    .update(await fs.readFile(path.join(ASSETS, "app.js")))
    .digest("hex")
    .slice(0, 8);

  const notes = await loadNotes(path.join(ROOT, "content", "notes"));

  const withDetail = data.projects.filter((p) => (p.body || "").length >= DETAIL_MIN_CHARS);
  const detailSlugs = new Set(withDetail.map((p) => p.key));

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(path.join(DIST, "p"), { recursive: true });
  if (notes.length) await fs.mkdir(path.join(DIST, "n"), { recursive: true });

  await fs.writeFile(path.join(DIST, "index.html"), indexPage(profile, data, detailSlugs, notes, assetVersion), "utf8");

  for (const project of withDetail) {
    await fs.writeFile(path.join(DIST, "p", `${project.slug}.html`), detailPage(profile, project, assetVersion), "utf8");
  }

  for (const note of notes) {
    await fs.writeFile(path.join(DIST, "n", `${note.slug}.html`), notePage(profile, note, assetVersion), "utf8");
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
