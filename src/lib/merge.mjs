import { dateRank, normalizeStatus, repoKey, slugify, titleize, toArray } from "./normalize.mjs";

// Une galerie peut etre declaree en forme courte (une liste de chemins) ou
// detaillee (objets avec legende). On ramene les deux a la meme structure.
function normalizeGallery(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return { url: item, title: "", description: "" };
      if (!item || typeof item !== "object") return null;
      const url = item.url || item.src || item.image;
      if (!url) return null;
      return {
        url: String(url),
        full: item.full ? String(item.full) : String(url),
        title: item.title || item.caption || item.legende || "",
        description: item.description || "",
      };
    })
    .filter(Boolean);
}

const first = (...values) => {
  for (const v of values) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && !v.trim()) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    return v;
  }
  return undefined;
};

const firstBool = (...values) => {
  for (const v of values) if (typeof v === "boolean") return v;
  return undefined;
};

// Fusionne les couches d'un meme projet.
// Priorite : overrides > portfolio.md > pocketbase > metadonnees GitHub > README.
// Exception : les donnees vivantes (etoiles, langages, derniere release, date de
// push) viennent toujours de GitHub, qui en est la seule source a jour.
export function mergeLayers({ gh, pmd, pb, ovr }) {
  const p = pmd || {};
  const o = ovr || {};
  const b = pb || {};
  const g = gh || {};

  const stack = first(
    toArray(o.stack),
    toArray(p.stack ?? p.tags ?? p.technologies),
    [b.language_prog, b.framework, b.module].filter(Boolean),
    g.languages,
    []
  );

  const links = { ...(g.links || {}), ...(b.links || {}), ...(p.links || {}), ...(o.links || {}) };
  if (g.links?.repo && !links.repo) links.repo = g.links.repo;

  const status = normalizeStatus(
    first(o.status, p.status ?? p.statut, b.status ?? b.statut),
    g.inferred || (g.archived ? "archived" : "wip")
  );

  const title =
    first(o.title, p.title ?? p.nom ?? p.name, b.nom ?? b.name ?? b.title, titleize(g.name)) ||
    "Sans titre";

  return {
    key: g.key || b.key || slugify(title),
    slug: slugify(first(o.slug, p.slug, b.slug, g.name, title)),
    title,
    summary: first(o.summary, p.summary ?? p.description, b.description, g.description, g.readmeSummary) || "",
    body: first(p.body, "") || "",
    type: first(o.type, p.type, b.type, g.type) || "",
    stack: [...new Set(stack.map(String))].slice(0, 8),
    status,
    started: first(o.started, p.started ?? p.date_debut, b.date_debut, g.created) || "",
    ended: first(o.ended, p.ended ?? p.date_fin, b.date_fin, status === "prod" || status === "wip" ? "" : g.pushed) || "",
    updated: g.pushed || first(b.updated, "") || "",
    featured: firstBool(o.featured, p.featured ?? p.pinned, b.pinned) ?? false,
    order: first(o.order, p.order, null),
    version: first(o.version, p.version, g.release?.tag, b.version) || "",
    prerelease: firstBool(p.prerelease, g.release?.prerelease, b.isPrerelease) ?? false,
    image: first(o.image, p.image ?? p.logo, b.image) || null,
    links,
    stars: g.stars || 0,
    contribution: g.contribution || null,
    // Galerie declaree a la main ; les sources externes (Modrinth) viennent
    // s'ajouter plus tard, sans ecraser ce qui a ete choisi ici.
    gallery: normalizeGallery(first(o.gallery, p.gallery, [])),
    modrinth: first(o.modrinth, p.modrinth, null) || null,
    org: g.org || null,
    hidden: firstBool(o.hidden, p.hidden) ?? false,
    sources: [g && "github", p.__present && "portfolio.md", b.id && "pocketbase"].filter(Boolean),
  };
}

// Rapproche les entrees PocketBase des repos GitHub deja collectes.
// D'abord sur le repo declare, sinon sur le slug du nom.
export function matchPocketbase(pbItems, githubByKey) {
  const bySlug = new Map();
  for (const [key, gh] of githubByKey) bySlug.set(slugify(gh.name), key);

  const matched = new Map();
  const orphans = [];

  for (const item of pbItems) {
    const declared = repoKey(item.repository || item.repo || item.github || item.url);
    let key = declared && githubByKey.has(declared) ? declared : null;
    if (!key) {
      const slug = slugify(item.nom || item.name || item.title);
      if (bySlug.has(slug)) key = bySlug.get(slug);
    }
    if (key) matched.set(key, item);
    else orphans.push(item);
  }

  return { matched, orphans };
}

// Applique alias_of : le projet source disparait de l'index et enrichit sa cible.
//
// Le sens du lien n'est pas toujours « ancienne version » : une reecriture en
// cours est plus recente que le projet qu'elle remplacera. On le deduit donc
// des dates de debut, et `relation` permet de trancher a la main.
export function collapseAliases(projects, overrides) {
  const byKey = new Map(projects.map((p) => [p.key, p]));
  const removed = [];

  for (const p of projects) {
    const ovr = overrides?.[p.key] || {};
    const target = ovr.alias_of;
    if (!target) continue;
    const dest = byKey.get(String(target).toLowerCase());
    if (!dest || dest.key === p.key) continue;

    const declared = String(ovr.relation || "").toLowerCase();
    const relation =
      declared === "successor" || declared === "predecessor"
        ? declared
        : dateRank(p.started) > dateRank(dest.started)
          ? "successor"
          : "predecessor";

    dest.aliases = dest.aliases || [];
    dest.aliases.push({
      key: p.key,
      title: p.title,
      repo: p.links?.repo || null,
      status: p.status,
      relation,
    });

    dest.stars += p.stars || 0;
    // Seul un predecesseur recule la date de debut : un successeur est, par
    // definition, plus recent que le projet qu'il prolonge.
    if (relation === "predecessor" && (!dest.started || dateRank(p.started) < dateRank(dest.started))) {
      dest.started = p.started;
    }
    removed.push(p.key);
  }

  return projects.filter((p) => !removed.includes(p.key));
}

const STATUS_WEIGHT = { prod: 0, wip: 1, paused: 2, archived: 3 };

export function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    if (a.order != null || b.order != null) {
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      if (a.order !== b.order) return a.order - b.order;
    }
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const sa = STATUS_WEIGHT[a.status] ?? 9;
    const sb = STATUS_WEIGHT[b.status] ?? 9;
    if (sa !== sb) return sa - sb;
    const ra = Math.max(dateRank(a.updated), dateRank(a.ended), dateRank(a.started));
    const rb = Math.max(dateRank(b.updated), dateRank(b.ended), dateRank(b.started));
    if (ra !== rb) return rb - ra;
    return a.title.localeCompare(b.title, "fr");
  });
}
