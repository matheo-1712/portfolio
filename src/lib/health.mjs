// Verifie qu'une URL declaree par un projet repond encore.
//
// L'etat du service est une dimension distincte de l'avancement du code : un
// projet fige peut tourner depuis des annees, un projet actif peut n'etre
// deploye nulle part. Seule une requete reelle permet de trancher.

// Plateformes tierces : elles repondent toujours, et leur disponibilite ne dit
// rien de l'infrastructure du projet. Les verifier n'apprendrait rien.
const THIRD_PARTY = [
  "discord.gg",
  "discord.com",
  "modrinth.com",
  "curseforge.com",
  "github.com",
  "gitlab.com",
  "npmjs.com",
  "crates.io",
  "docker.com",
  "youtube.com",
];

const TIMEOUT_MS = 10000;

// Un service peut avoir un hoquet le jour de la collecte. On ne le declare
// hors ligne qu'apres ce delai sans reponse, pour eviter les faux negatifs.
const GRACE_DAYS = 7;

export function isThirdParty(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return THIRD_PARTY.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return true; // URL illisible : on s'abstient plutot que de signaler a tort
  }
}

async function ping(url) {
  const attempt = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "portfolio-healthcheck" },
      });
      return res.status;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    // HEAD d'abord : inutile de telecharger la page. Certains serveurs ne
    // l'implementent pas et repondent 405 ou 501, d'ou le repli sur GET.
    const status = await attempt("HEAD");
    if (status === 405 || status === 501 || status === 403) return await attempt("GET");
    return status;
  } catch {
    return 0; // injoignable : DNS, TLS, timeout, connexion refusee
  }
}

// Un service protege par authentification repond 401/403 : il tourne quand meme.
const isUp = (status) => status > 0 && status < 500 && status !== 404;

export async function checkUrls(urls, previous = {}) {
  const results = {};
  const today = new Date().toISOString().slice(0, 10);

  const checks = [...new Set(urls)]
    .filter((u) => u && /^https?:\/\//.test(u) && !isThirdParty(u))
    .map(async (url) => {
      const status = await ping(url);
      const up = isUp(status);
      const before = previous[url] || {};

      if (up) {
        results[url] = { up: true, status, lastSeenUp: today };
        return;
      }

      // Hors ligne aujourd'hui : on consulte la derniere reponse connue avant
      // de le declarer, pour absorber les indisponibilites passageres.
      const last = before.lastSeenUp;
      const days = last ? (Date.now() - new Date(last).getTime()) / 86400000 : Infinity;

      results[url] = {
        up: days <= GRACE_DAYS ? true : false,
        uncertain: days <= GRACE_DAYS,
        status,
        lastSeenUp: last || null,
      };
    });

  await Promise.all(checks);
  return results;
}
