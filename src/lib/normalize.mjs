import YAML from "yaml";

export function slugify(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Separe le front-matter YAML du corps markdown.
export function frontmatter(text) {
  if (!text) return { data: {}, body: "" };
  const m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  let data = {};
  try {
    data = YAML.parse(m[1]) || {};
  } catch {
    data = {};
  }
  return { data, body: m[2] || "" };
}

const NOISE_HEADINGS =
  /^(installation|install|getting started|démarrage|demarrage|prérequis|prerequis|prerequisites|usage|utilisation|configuration|config|licence|license|contributing|contribution|contributeurs|contributors|credits|crédits|remerciements|sommaire|table des matières|table of contents|toc|changelog|roadmap|todo|tests?|déploiement|deploiement|deployment|support|faq|auteurs?|authors?)\b/i;

// Retire ce qui ne dit rien d'un projet : badges, titre, sections d'install.
export function cleanReadme(md) {
  if (!md) return "";
  let text = md.replace(/\r\n/g, "\n");

  text = text.replace(/^\uFEFF?---\n[\s\S]*?\n---\n/, ""); // front-matter
  text = text.replace(/<!--[\s\S]*?-->/g, ""); // commentaires HTML
  text = text.replace(/^\s*<(p|div|h1|a|picture|center)[^>]*>[\s\S]*?<\/\1>\s*$/gim, ""); // blocs HTML d'en-tete
  text = text.replace(/^\s*<img[^>]*>\s*$/gim, ""); // <img> seule : balise auto-fermante
  text = text.replace(/^\s*\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)\s*$/gm, ""); // badge cliquable
  text = text.replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*$/gm, ""); // image seule sur sa ligne
  text = text.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, ""); // badges inline
  text = text.replace(/!\[[^\]]*\]\((?:https?:\/\/)?(?:img\.shields\.io|badge\.fury\.io|badgen\.net|codecov\.io)[^)]*\)/g, "");
  text = text.replace(/^\s*#{1,6}\s*$/gm, ""); // titre vide servant de separateur

  const lines = text.split("\n");
  const kept = [];
  let skipping = false;

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].replace(/[*_`#:]/g, "").trim();
      if (level === 1) { skipping = false; continue; } // le H1 repete le nom du projet
      skipping = NOISE_HEADINGS.test(title);
      if (skipping) continue;
    }
    if (!skipping) kept.push(line);
  }

  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Premier vrai paragraphe : sert de resume quand rien d'autre n'est fourni.
export function firstParagraph(md, maxLen = 260) {
  const clean = cleanReadme(md);
  if (!clean) return "";
  for (const block of clean.split(/\n\s*\n/)) {
    let p = block.trim();
    if (!p || p.startsWith("#") || p.startsWith("```") || p.startsWith("|") || p.startsWith(">")) continue;
    if (/^[-*+]\s/.test(p) || /^\d+\.\s/.test(p)) continue;
    p = p
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // liens -> texte
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (p.length < 25) continue;
    if (p.length <= maxLen) return p;
    const cut = p.slice(0, maxLen);
    const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" ! "), cut.lastIndexOf(" ? "));
    return (stop > maxLen * 0.5 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, "") + "…").trim();
  }
  return "";
}

const MONTHS = ["janv.","févr.","mars","avril","mai","juin","juill.","août","sept.","oct.","nov.","déc."];

// Accepte "24/06/2024", "2024-06-24", "2024-06", "2024", Date ISO.
export function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date && !isNaN(value)) return { y: value.getUTCFullYear(), m: value.getUTCMonth() + 1 };
  const s = String(value).trim();

  let m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (m) return { y: +m[3], m: +m[2] };
  m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s);
  if (m) return { y: +m[1], m: +m[2] };
  m = /^(\d{4})$/.exec(s);
  if (m) return { y: +m[1], m: null };

  const d = new Date(s);
  return isNaN(d) ? null : { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
}

export function formatDate(value, { withMonth = true } = {}) {
  const d = parseDate(value);
  if (!d) return "";
  if (!withMonth || !d.m) return String(d.y);
  return `${MONTHS[d.m - 1]} ${d.y}`;
}

export const dateRank = (value) => {
  const d = parseDate(value);
  return d ? d.y * 12 + (d.m || 1) : 0;
};

const STATUS = new Set(["prod", "wip", "paused", "archived"]);
export function normalizeStatus(value, fallback = "wip") {
  const s = String(value ?? "").toLowerCase().trim();
  if (STATUS.has(s)) return s;
  if (s === "1" || s === "true" || s === "actif" || s === "active" || s === "online") return "prod";
  if (s === "0" || s === "false" || s === "inactif") return "archived";
  if (/maintenu|abandon|deprecated|dead/.test(s)) return "archived";
  if (/pause|hold|suspend/.test(s)) return "paused";
  if (/cours|progress|dev|beta|alpha/.test(s)) return "wip";
  return fallback;
}

export function toArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(/[,;|]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

// Le portfolio n'utilise pas d'emoji : on les retire des textes repris
// automatiquement des descriptions GitHub et des README.
export function stripEmoji(s) {
  return String(s || "")
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{20E3}]/gu,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

// Transforme un topic GitHub en libelle lisible : "api-rest" -> "API REST".
const TYPE_LABELS = {
  "api-rest": "API REST",
  "rest-api": "API REST",
  api: "API",
  "discord-bot": "Bot Discord",
  bot: "Bot",
  cli: "Outil CLI",
  framework: "Framework",
  website: "Site web",
  "web-app": "Application web",
  mobile: "Application mobile",
  android: "Application mobile",
  plugin: "Plugin",
  mod: "Mod",
  datapack: "Datapack",
  library: "Bibliotheque",
  monitoring: "Monitoring",
};

export function labelType(raw) {
  if (!raw) return "";
  const key = String(raw).toLowerCase().trim();
  if (TYPE_LABELS[key]) return TYPE_LABELS[key];
  return key.replace(/[-_]+/g, " ").replace(/^\p{L}/u, (c) => c.toUpperCase());
}

// Les topics d'un depot melangent le type de projet ("discord-bot") et des
// etiquettes de contexte ("antredesloutres", "rust"). Seuls les premiers
// renseignent le champ Type ; les autres ne diraient rien au lecteur.
export function knownType(topics) {
  for (const topic of topics || []) {
    const key = String(topic).toLowerCase().trim();
    if (TYPE_LABELS[key]) return TYPE_LABELS[key];
  }
  return "";
}

// Statut deduit de l'activite du repo, quand aucune source ne le declare.
// Une release stable et une activite recente valent mieux qu'un "en cours" par defaut.
export function inferStatus({ archived, pushed, release }) {
  if (archived) return "archived";
  const months = pushed ? (Date.now() - new Date(pushed).getTime()) / 2.592e9 : Infinity;
  if (months > 18) return "archived";
  if (months > 9) return "paused";
  if (release && !release.prerelease) return "prod";
  return "wip";
}

// Un nom de repo n'est pas un titre : "cobblemon-trainers" -> "Cobblemon Trainers".
// Les noms deja capitalises (OAPI, CitlAPI) sont laisses intacts.
export function titleize(name) {
  const s = String(name || "").trim();
  if (!s) return "";
  if (!/[-_]/.test(s)) return s;
  return s
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => (/[A-Z]/.test(w.slice(1)) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function repoKey(input) {
  if (!input) return null;
  const s = String(input).trim();
  const m = /github\.com\/([^/\s]+)\/([^/\s#?]+)/i.exec(s) || /^([\w.-]+)\/([\w.-]+)$/.exec(s);
  if (!m) return null;
  return `${m[1]}/${m[2].replace(/\.git$/, "")}`.toLowerCase();
}
