// Galerie declaree directement dans le depot du projet.
//
// Convention : toute image deposee dans `.portfolio/gallery/` devient une
// capture de la fiche. Rien a configurer cote portfolio — le depot porte ses
// propres illustrations, comme il porte deja son portfolio.md.
//
// Les images sont rapatriees dans static/img/shots/<slug>/ pour etre servies
// par le site lui-meme : pas de lien vers raw.githubusercontent au chargement
// de la page, et les captures restent versionnees avec le portfolio.

import fs from "node:fs/promises";
import path from "node:path";

const DOSSIER = ".portfolio/gallery";
const EXTENSIONS = /\.(png|jpe?g|webp|gif|avif)$/i;

// `03-ecran-d-accueil.png` -> « Ecran d accueil ». Le prefixe numerique sert a
// ordonner les captures et n'apparait pas dans la legende.
export function titreDepuisNom(fichier) {
  const base = fichier
    .replace(EXTENSIONS, "")
    .replace(/^\d+\s*[-_.]\s*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!base) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

// Legendes explicites, quand les noms de fichiers ne suffisent pas.
// `.portfolio/gallery.yml` : { "accueil.png": "Page d'accueil" }
function parseLegendes(texte) {
  if (!texte) return {};
  const out = {};
  for (const ligne of texte.split("\n")) {
    const m = /^\s*["']?([^"':]+?)["']?\s*:\s*["']?(.+?)["']?\s*$/.exec(ligne);
    if (m && !ligne.trim().startsWith("#")) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

/**
 * Recupere la galerie d'un depot et ecrit les images sous static/.
 * Renvoie la liste prete a etre stockee dans projects.json, ou [] si le depot
 * ne declare pas de galerie.
 */
export async function collectRepoGallery({ owner, repo, slug, listDir, rawFile, staticDir }) {
  const entrees = await listDir(owner, repo, DOSSIER);
  if (!entrees || !entrees.length) return [];

  const images = entrees
    .filter((e) => e.type === "file" && EXTENSIONS.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }));

  if (!images.length) return [];

  const legendes = parseLegendes(await rawFile(owner, repo, ".portfolio/gallery.yml"));

  const dest = path.join(staticDir, "img", "shots", slug);
  await fs.mkdir(dest, { recursive: true });

  // Ce qui n'est plus dans le depot ne doit pas survivre en local : une capture
  // supprimee la-bas disparait ici au prochain passage.
  const attendus = new Set(images.map((i) => i.name));
  for (const present of await fs.readdir(dest).catch(() => [])) {
    if (!attendus.has(present)) await fs.rm(path.join(dest, present), { force: true });
  }

  const galerie = [];
  for (const image of images) {
    const fichier = path.join(dest, image.name);

    // La taille annoncee par l'API suffit a savoir si le fichier a change :
    // inutile de retelecharger des captures stables a chaque collecte.
    const local = await fs.stat(fichier).catch(() => null);
    if (!local || local.size !== image.size) {
      const res = await fetch(image.download_url);
      if (!res.ok) continue;
      await fs.writeFile(fichier, Buffer.from(await res.arrayBuffer()));
    }

    const rel = `img/shots/${slug}/${image.name}`;
    galerie.push({
      url: rel,
      full: rel,
      title: legendes[image.name] || titreDepuisNom(image.name),
      description: "",
    });
  }

  return galerie;
}

export const DOSSIER_GALERIE = DOSSIER;
