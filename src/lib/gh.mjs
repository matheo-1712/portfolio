// Client GitHub minimal. Utilise l'API pour les metadonnees et raw.githubusercontent
// pour les fichiers : raw n'est pas soumis au rate limit de l'API, ce qui permet de
// sonder portfolio.md sur des dizaines de repos sans bruler le quota.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const API = "https://api.github.com";
const RAW = "https://raw.githubusercontent.com";

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

// Cache disque local. Sans token l'API est limitee a 60 requetes par heure, ce
// qui ne suffit pas pour relancer la collecte en developpement. Desactive en CI,
// ou GITHUB_TOKEN donne un quota large et ou l'on veut des donnees fraiches.
const CACHE_DIR = path.resolve(import.meta.dirname, "../../.cache");
const CACHE_TTL = Number(process.env.PORTFOLIO_CACHE_TTL ?? 3600) * 1000;
const CACHE_ON = process.env.PORTFOLIO_CACHE !== "0" && !process.env.CI;

function cachePath(url) {
  return path.join(CACHE_DIR, crypto.createHash("sha1").update(url).digest("hex") + ".json");
}

function cacheRead(url) {
  if (!CACHE_ON) return undefined;
  try {
    const file = cachePath(url);
    const stat = fs.statSync(file);
    if (Date.now() - stat.mtimeMs > CACHE_TTL) return undefined;
    return JSON.parse(fs.readFileSync(file, "utf8")).value;
  } catch {
    return undefined;
  }
}

function cacheWrite(url, value) {
  if (!CACHE_ON) return;
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(url), JSON.stringify({ url, value }), "utf8");
  } catch {
    /* le cache est un confort, jamais une dependance */
  }
}

function headers() {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-builder",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function api(path, { allow404 = false } = {}) {
  const url = `${API}${path}`;
  const hit = cacheRead(url);
  if (hit !== undefined) return hit;

  const res = await fetch(url, { headers: headers() });
  if (res.status === 404 && allow404) {
    cacheWrite(url, null);
    return null;
  }
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : "?";
    throw new Error(`GitHub rate limit atteint (reset ${when}). Definis GITHUB_TOKEN.`);
  }
  if (!res.ok) throw new Error(`GitHub ${res.status} sur ${path}`);
  const data = await res.json();
  cacheWrite(url, data);
  return data;
}

// Recupere un fichier a la racine d'un repo via raw. null si absent.
export async function rawFile(owner, repo, path) {
  const url = `${RAW}/${owner}/${repo}/HEAD/${path}`;
  const hit = cacheRead(url);
  if (hit !== undefined) return hit;

  const res = await fetch(url);
  const text = res.ok ? await res.text() : "";
  const value = text.trim() ? text : null;
  cacheWrite(url, value);
  return value;
}

async function paginate(path) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const batch = await api(`${path}${sep}per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

export const listUserRepos = (user) => paginate(`/users/${user}/repos?sort=updated`);
export const listOrgRepos = (org) => paginate(`/orgs/${org}/repos?sort=updated`);

// Langages d'outillage : presents dans presque tous les repos, ils ne disent
// rien du projet. On ne les garde que s'ils en sont le langage principal.
const TOOLING = new Set([
  "HTML", "CSS", "SCSS", "Dockerfile", "Shell", "Batchfile", "Makefile",
  "PowerShell", "Procfile", "Nix", "Roff", "Gradle", "CMake",
]);

export async function repoLanguages(owner, repo) {
  const data = await api(`/repos/${owner}/${repo}/languages`, { allow404: true });
  if (!data) return [];
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const ranked = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return ranked
    .filter(([name, bytes], i) => bytes / total >= 0.08 && (i === 0 || !TOOLING.has(name)))
    .map(([name]) => name);
}

export async function latestRelease(owner, repo) {
  const rels = await api(`/repos/${owner}/${repo}/releases?per_page=5`, { allow404: true });
  if (!Array.isArray(rels) || rels.length === 0) return null;
  const rel = rels.find((r) => !r.draft) || null;
  if (!rel) return null;
  return { tag: rel.tag_name, prerelease: !!rel.prerelease, published: rel.published_at };
}

// Qui a reellement ecrit du code dans ce depot, et combien.
// Sert a ne retenir que les projets auxquels on a participe : figurer dans une
// organisation ne signifie pas avoir contribue au depot.
export async function contributors(owner, repo) {
  const list = await api(`/repos/${owner}/${repo}/contributors?per_page=100`, { allow404: true });
  if (!Array.isArray(list)) return null; // depot vide, ou statistiques indisponibles
  return list
    .filter((c) => c.type !== "Bot" && c.login)
    .map((c) => ({ login: c.login.toLowerCase(), commits: c.contributions || 0 }))
    .sort((a, b) => b.commits - a.commits);
}

export async function rateStatus() {
  try {
    const d = await api("/rate_limit");
    return `${d.rate.remaining}/${d.rate.limit}`;
  } catch {
    return "inconnu";
  }
}

export const hasToken = () => Boolean(token);
