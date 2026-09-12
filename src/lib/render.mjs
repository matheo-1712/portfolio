import { Marked } from "marked";
import { formatDate, labelType, slugify } from "./normalize.mjs";
import { monogram, monogramHue, techColor } from "./colors.mjs";

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const attr = (s) => esc(s).replace(/'/g, "&#39;");

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    // Les tableaux doivent pouvoir deborder sans casser la largeur de la page.
    table(token) {
      const html = this.constructor.prototype.table.call(this, token);
      return `<div class="table-scroll">${html}</div>`;
    },

    // Titres ancres, comme sur GitHub : un sommaire ecrit en markdown pointe
    // vers `#mon-titre`, ces liens doivent aboutir.
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const id = slugify(token.text);
      const level = token.depth;
      return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${level}>\n`;
    },

    // Le langage d'un bloc de code est porte par <code> ; on le remonte sur
    // <pre> pour pouvoir l'afficher en etiquette.
    code(token) {
      const html = this.constructor.prototype.code.call(this, token);
      const lang = (token.lang || "").split(/\s+/)[0];
      return lang ? html.replace("<pre>", `<pre data-lang="${esc(lang)}">`) : html;
    },
  },
});

const ALERTS = {
  NOTE: "Note",
  TIP: "Astuce",
  IMPORTANT: "Important",
  WARNING: "Attention",
  CAUTION: "Danger",
};

// Les alertes GitHub (`> [!NOTE]`) sont rendues par marked comme de simples
// citations : on les reconnait apres coup pour leur donner leur forme propre.
function renderAlerts(html) {
  return html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br>)?\s*/gi,
    (_, kind) => {
      const key = kind.toUpperCase();
      return `<blockquote class="alert alert-${key.toLowerCase()}"><p class="alert-title">${ALERTS[key]}</p><p>`;
    }
  );
}

// Cases a cocher des listes de taches. L'ordre des attributs varie selon que
// la case est cochee ou non : on cible donc la balise, pas sa forme exacte.
function renderTaskLists(html) {
  return html.replace(
    /<li>(\s*<input[^>]*type="checkbox"[^>]*>)/g,
    '<li class="task">$1'
  );
}

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

  html = renderAlerts(html);
  html = renderTaskLists(html);

  // Les liens sortants s'ouvrent dans un nouvel onglet, avec la protection
  // d'usage. Les ancres internes (#section) restent dans la page.
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
  return html;
}

// Jeu de pictogrammes, defini une seule fois par page et reference par <use> :
// repeter le SVG a chaque lien couterait plusieurs kilooctets pour rien.
const ICONES = {
  details: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  site: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  doc: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  telecharger: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  paquet: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
  retour: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
};

export function spriteIcones() {
  const symbols = Object.entries(ICONES)
    .map(([nom, d]) => `<symbol id="i-${nom}" viewBox="0 0 24 24">${d}</symbol>`)
    .join("");
  return `<svg class="sprite" aria-hidden="true" focusable="false"><defs>${symbols}</defs></svg>`;
}

export const icone = (nom) =>
  ICONES[nom] ? `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-${nom}"/></svg>` : "";

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

const LIENS = {
  repo: { label: "code", icone: "code" },
  demo: { label: "site", icone: "site" },
  docs: { label: "doc", icone: "doc" },
  download: { label: "télécharger", icone: "telecharger" },
  package: { label: "paquet", icone: "paquet" },
};

const linkLabel = (key) => (LIENS[key] || {}).label || key;
const linkIcone = (key) => icone((LIENS[key] || {}).icone || "");

// Un lien vers un service eteint n'est pas propose : mieux vaut ne rien
// afficher qu'envoyer le lecteur sur une page morte. L'information reste
// visible sur la fiche du projet, qui indique l'etat du service.
export const linkIsDead = (project, url) =>
  project.service?.urls && project.service.urls[url] === false;

function projectLinks(project, { detailHref } = {}) {
  const parts = [];
  if (detailHref) parts.push(`<a href="${attr(detailHref)}">${icone("details")}détails</a>`);
  for (const [key, url] of Object.entries(project.links || {})) {
    if (!url || linkIsDead(project, url)) continue;
    parts.push(
      `<a href="${attr(url)}" target="_blank" rel="noopener noreferrer">${linkIcone(key)}${esc(
        linkLabel(key)
      )}</a>`
    );
  }
  return parts.length ? `<span class="project-links">${parts.join("")}</span>` : "";
}

// Vignette : le logo du projet s'il en a un, sinon un monogramme dont la teinte
// est derivee du nom — stable d'un build a l'autre, et jamais deux fois la meme
// couleur pour deux projets voisins.
export function thumbnail(project, { prefix = "" } = {}) {
  // Deux origines possibles : un fichier depose dans static/img/projects/ (repere
  // au build), ou une image declaree dans portfolio.md / overrides.yml. La
  // premiere gagne, parce qu'elle est servie par le site lui-meme.
  const src = project.thumb ? prefix + project.thumb : project.image || "";

  if (src) {
    return `<span class="thumb"><img src="${attr(src)}" alt="" width="44" height="44" loading="lazy" decoding="async"></span>`;
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

  // Un compteur de telechargements est une preuve d'usage : il a sa place dans
  // l'index, pas seulement sur la fiche.
  const downloads = project.modrinth?.downloads
    ? `${new Intl.NumberFormat("fr-FR").format(project.modrinth.downloads)} téléchargements`
    : "";

  const meta = [type, when, downloads]
    .filter(Boolean)
    .map((v) => `<span>${esc(v)}</span>`)
    .join("");

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

export function layout({
  title,
  description,
  url,
  canonical,
  body,
  assetsPrefix = "",
  extraHead = "",
  // Empreinte du contenu des assets. Sans elle, un navigateur qui a deja
  // visite le site continue de servir l'ancien CSS apres une republication :
  // le HTML est neuf, la mise en page est celle de la veille.
  assetVersion = "",
}) {
  const v = assetVersion ? `?v=${assetVersion}` : "";
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
<link rel="stylesheet" href="${assetsPrefix}style.css${v}">
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
${spriteIcones()}
${body}
<script src="${assetsPrefix}app.js${v}" defer></script>
</body>
</html>
`;
}
