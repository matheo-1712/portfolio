// Couleurs par technologie. Celles des langages reprennent les teintes de
// GitHub Linguist, celles des frameworks leur couleur de marque : le lecteur
// retrouve des reperes qu'il connait deja, et la couleur porte une information
// au lieu de decorer.

const COLORS = {
  // Langages (Linguist)
  typescript: "#3178c6",
  javascript: "#d9b422",
  rust: "#c46b35",
  kotlin: "#a97bff",
  java: "#b07219",
  php: "#4f5d95",
  python: "#3572a5",
  "c++": "#f34b7d",
  c: "#555555",
  "c#": "#178600",
  ruby: "#701516",
  go: "#00add8",
  swift: "#f05138",
  dart: "#00b4ab",
  lua: "#2c2d72",
  shell: "#5c8a3c",
  html: "#e34c26",
  css: "#663399",
  scss: "#c6538c",
  mcfunction: "#e22837",
  vue: "#41b883",
  svelte: "#ff3e00",
  elixir: "#6e4a7e",
  haskell: "#5e5086",
  zig: "#ec915c",

  // Frameworks et outils
  astro: "#ff5a03",
  react: "#2b9fc4",
  "next.js": "#444444",
  nextjs: "#444444",
  laravel: "#ff2d20",
  symfony: "#3c3c3c",
  express: "#6c757d",
  "node.js": "#539e43",
  nodejs: "#539e43",
  "discord.js": "#5865f2",
  axum: "#a4573b",
  tokio: "#8c6fd0",
  tailwind: "#2aa5c7",
  docker: "#2496ed",
  linux: "#916b12",
  sql: "#4a7fb5",
  mariadb: "#a0785a",
  postgresql: "#336791",
  mysql: "#00618a",
  pocketbase: "#b8dbe4",
  android: "#3ddc84",
  spring: "#6db33f",
  firebase: "#ffa000",
};

const NEUTRAL = "#8b9198";

export const techColor = (name) => COLORS[String(name || "").toLowerCase().trim()] || NEUTRAL;

export const hasColor = (name) => Boolean(COLORS[String(name || "").toLowerCase().trim()]);

// Couleur stable pour le monogramme d'un projet sans logo. Derivee du nom :
// le meme projet garde la meme teinte d'un build a l'autre.
export function monogramHue(seed) {
  let hash = 0;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) % 360;
  return hash;
}

export function monogram(title) {
  const words = String(title || "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Repartition des technologies sur l'ensemble des projets, pour la barre
// recapitulative. Ne garde que ce qui est reellement recurrent.
export function techBreakdown(projects, { max = 8 } = {}) {
  const counts = new Map();
  for (const p of projects) {
    // Le premier element de la pile est le langage principal : il pese double.
    p.stack.forEach((tech, i) => {
      counts.set(tech, (counts.get(tech) || 0) + (i === 0 ? 2 : 1));
    });
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, max);
  const rest = ranked.slice(max).reduce((sum, [, n]) => sum + n, 0);
  const total = ranked.reduce((sum, [, n]) => sum + n, 0) || 1;

  const slices = top.map(([name, n]) => ({
    name,
    color: techColor(name),
    percent: (n / total) * 100,
  }));

  if (rest > 0) slices.push({ name: "autres", color: NEUTRAL, percent: (rest / total) * 100 });
  return slices;
}
