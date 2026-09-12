import { Marked } from "marked";
import { formatDate, labelType } from "./normalize.mjs";
import { monogram, monogramHue, techColor } from "./colors.mjs";

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const attr = (s) => esc(s).replace(/'/g, "&#39;");

const marked = new Marked({ gfm: true, breaks: false });

// Les tableaux doivent pouvoir déborder sans casser la largeur de la page.
marked.use({
  renderer: {
    table(token) {
      const html = this.constructor.prototype.table.call(this, token);
      return `<div class="table-scroll">${html}</div>`;
    },
  },
});

export function markdown(src, { baseUrl } = {}) {
  if (!src) return "";
  let html = marked.parse(src);

  // Un README écrit pour GitHub référence ses images en relatif : sans réécriture
  // elles pointeraient vers le portfolio et seraient introuvables.
  if (baseUrl) {
    html = html.replace(/(<img[^>]+src=")(?!https?:|data:|\/\/)([^"]+)(")/g, (_, a, src, b) => {
      return a + baseUrl.replace(/\/$/, "") + "/" + src.replace(/^\.?\//, "") + b;
    });
  }

  // Les liens sortants s'ouvrent dans un nouvel onglet, avec la protection d'usage.
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return html;
}

const STATUS_LABEL = {
  prod: "en production",
  wip: "en cours",
  paused: "en pause",
  archived: "archivé",
};

export const statusLabel = (s) => STATUS_LABEL[s] || s;

function period(project) {
  const thisYear = new Date().getFullYear();
  const startsThisYear = String(project.started || "").includes(String(thisYear));

  // "depuis 2026" ne dit rien en 2026 : on precise le mois pour l'annee en cours.
  const start = formatDate(project.started, { withMonth: startsThisYear });
  if (project.status === "prod" || project.status === "wip") {
    return start ? `depuis ${start}` : "";
  }
  const end = formatDate(project.ended || project.updated, { withMonth: false });
  const startYear = formatDate(project.started, { withMonth: false });
  if (startYear && end && startYear !== end) return `${startYear} – ${end}`;
  return end || startYear || "";
}

function linkLabel(key) {
  const labels = { repo: "code", demo: "site", docs: "doc", download: "télécharger", package: "paquet" };
  return labels[key] || key;
}

// Un lien vers un service eteint n'est pas propose : mieux vaut ne rien
// afficher qu'envoyer le lecteur sur une page morte. L'information reste
// visible sur la fiche du projet, qui indique l'etat du service.
export const linkIsDead = (project, url) =>
  project.service?.urls && project.service.urls[url] === false;

function projectLinks(project, { detailHref } = {}) {
  const parts = [];
  if (detailHref) parts.push(`<a href="${attr(detailHref)}">détails</a>`);
  for (const [key, url] of Object.entries(project.links || {})) {
    if (!url || linkIsDead(project, url)) continue;
    parts.push(
      `<a href="${attr(url)}" target="_blank" rel="noopener noreferrer">${esc(linkLabel(key))}</a>`
    );
  }
  return parts.length ? `<span class="project-links">${parts.join("")}</span>` : "";
}

// Vignette : le logo du projet s'il en a un, sinon un monogramme dont la teinte
// est derivee du nom — stable d'un build a l'autre, et jamais deux fois la meme
// couleur pour deux projets voisins.
export function thumbnail(project, { prefix = "" } = {}) {
  if (project.thumb) {
    return `<span class="thumb"><img src="${attr(prefix + project.thumb)}" alt="" width="44" height="44" loading="lazy" decoding="async"></span>`;
  }
  const hue = monogramHue(project.slug || project.title);
  return `<span class="thumb thumb-mono" style="--hue:${hue}" aria-hidden="true">${esc(
    monogram(project.title)
  )}</span>`;
}

export function projectRow(project, { detailHref } = {}) {
  const stack = project.stack.length
    ? `<span class="stack">${project.stack
        .map(
          (s) =>
            `<span class="tech"><i style="background:${techColor(s)}"></i>${esc(s)}</span>`
        )
        .join("")}</span>`
    : "";

  const when = period(project);
  const type = project.type ? labelType(project.type) : "";

  const meta = [type, when].filter(Boolean).map((v) => `<span>${esc(v)}</span>`).join("");

  const version = project.version
    ? `<span class="project-version">${esc(project.version)}${project.prerelease ? " (pré)" : ""}</span>`
    : "";

  const titleInner = detailHref
    ? `<a href="${attr(detailHref)}">${esc(project.title)}</a>`
    : project.links?.repo
      ? `<a href="${attr(project.links.repo)}" target="_blank" rel="noopener noreferrer">${esc(project.title)}</a>`
      : esc(project.title);

  return `
    <li class="project" data-status="${attr(project.status)}" data-stack="${attr(project.stack.join("|"))}">
      ${thumbnail(project)}
      <div class="project-main">
        <h3 class="project-title">
          ${titleInner}
          <span class="status" data-status="${attr(project.status)}">${esc(statusLabel(project.status))}</span>
        </h3>
        ${project.summary ? `<p class="project-summary">${esc(project.summary)}</p>` : ""}
        <div class="project-foot">
          ${stack}${meta}${projectLinks(project, { detailHref })}
        </div>
      </div>
      ${version}
    </li>`;
}

export function layout({ title, description, url, canonical, body, assetsPrefix = "", extraHead = "" }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
${canonical ? `<link rel="canonical" href="${attr(canonical)}">` : ""}
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
${url ? `<meta property="og:url" content="${attr(url)}">` : ""}
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="${assetsPrefix}style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='25' font-size='26' font-family='monospace'>M</text></svg>">
<script>
/* Applique le thème enregistré avant le premier rendu, pour éviter le flash
   de la mauvaise palette au chargement. */
(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
</script>
${extraHead}
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
${body}
<script src="${assetsPrefix}app.js" defer></script>
</body>
</html>
`;
}
