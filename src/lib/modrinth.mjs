// Recupere la galerie, l'icone et les telechargements d'un projet publie sur
// Modrinth. Ces donnees n'existent nulle part dans un depot GitHub : une capture
// d'ecran d'un mod vit sur la page de publication, pas dans le code.

const API = "https://api.modrinth.com/v2";

// Modrinth sert plusieurs types de projets sous des chemins differents.
const URL_PATTERN =
  /modrinth\.com\/(?:mod|plugin|datapack|resourcepack|shader|modpack|project)\/([A-Za-z0-9!@$()`.+,_"'-]+)/i;

export function slugFromUrl(url) {
  const m = URL_PATTERN.exec(String(url || ""));
  return m ? m[1] : null;
}

// Trouve la reference Modrinth d'un projet : declaree explicitement, ou deduite
// de l'un de ses liens.
export function findSlug(project) {
  if (project.modrinth) return String(project.modrinth).trim();
  for (const url of Object.values(project.links || {})) {
    const slug = slugFromUrl(url);
    if (slug) return slug;
  }
  return null;
}

export async function fetchProject(slug) {
  const res = await fetch(`${API}/project/${encodeURIComponent(slug)}`, {
    headers: { "User-Agent": "portfolio-builder (github.com/matheo-1712)" },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Modrinth ${res.status} pour ${slug}`);

  const d = await res.json();

  // L'ordre de la galerie est celui choisi sur Modrinth ; les images mises en
  // avant passent devant, comme sur la page du projet.
  const gallery = (d.gallery || [])
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (a.ordering ?? 0) - (b.ordering ?? 0))
    .map((img) => ({
      url: img.url,
      // Le CDN sert aussi l'original, sans le suffixe de taille ni l'extension.
      full: img.url.replace(/_\d+\.webp$/, ".png"),
      title: img.title || "",
      description: img.description || "",
      featured: Boolean(img.featured),
    }));

  return {
    slug,
    url: `https://modrinth.com/project/${slug}`,
    title: d.title || "",
    description: d.description || "",
    icon: d.icon_url || null,
    downloads: d.downloads || 0,
    followers: d.followers || 0,
    license: d.license?.id || "",
    categories: d.categories || [],
    gallery,
  };
}
