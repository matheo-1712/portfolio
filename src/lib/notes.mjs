// Les notes sont de simples fichiers markdown dans content/notes/.
// Rien a collecter, rien a configurer : deposer un .md suffit a publier.

import fs from "node:fs/promises";
import path from "node:path";

import { dateRank, frontmatter, slugify } from "./normalize.mjs";

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatLongDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return String(value || "");
  return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Estimation de lecture : 200 mots par minute, arrondie a la minute superieure.
function readingTime(body) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function loadNotes(dir) {
  let files;
  try {
    files = await fs.readdir(dir);
  } catch {
    return []; // pas de dossier content/notes : la section ne s'affiche pas
  }

  const notes = [];
  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const { data, body } = frontmatter(raw);
    const text = body.trim();

    // Un brouillon reste invisible en ligne, mais se previsualise en local.
    if (data.draft && process.env.NODE_ENV !== "development") continue;

    const title = data.title || file.replace(/\.md$/, "");

    notes.push({
      slug: slugify(data.slug || file.replace(/\.md$/, "")),
      title,
      summary: data.summary || data.description || "",
      date: data.date ? String(data.date).slice(0, 10) : "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: Boolean(data.draft),
      body: text,
      minutes: readingTime(text),
    });
  }

  // Les plus recentes d'abord ; a date egale, ordre alphabetique stable.
  return notes.sort(
    (a, b) => dateRank(b.date) - dateRank(a.date) || a.title.localeCompare(b.title, "fr")
  );
}
