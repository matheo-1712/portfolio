// Client PocketBase. Non bloquant : si la collection est fermee et qu'aucun
// identifiant n'est fourni, on previent et on continue sans cette source.

async function authenticate(base) {
  const email = process.env.PB_EMAIL;
  const password = process.env.PB_PASSWORD;
  if (!email || !password) return null;

  // PocketBase >= 0.23 utilise _superusers ; les versions anterieures /api/admins.
  const endpoints = [
    `${base}/api/collections/_superusers/auth-with-password`,
    `${base}/api/admins/auth-with-password`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: email, email, password }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.token) return data.token;
    } catch {
      /* essaie l'endpoint suivant */
    }
  }
  return null;
}

async function fetchPage(base, collection, page, token) {
  const url = `${base}/api/collections/${collection}/records?perPage=200&page=${page}`;
  const headers = token ? { Authorization: token } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`PocketBase ${res.status}: ${body.slice(0, 160)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchProjects({ url, collection }) {
  const base = url.replace(/\/+$/, "");
  let token = null;

  try {
    await fetchPage(base, collection, 1, null);
  } catch (err) {
    if (err.status !== 403 && err.status !== 401) throw err;
    token = await authenticate(base);
    if (!token) {
      throw new Error(
        `collection "${collection}" fermee. Ouvre sa regle de list ` +
          `(ex: published = true) ou definis PB_EMAIL / PB_PASSWORD.`
      );
    }
  }

  const items = [];
  for (let page = 1; page <= 20; page++) {
    const data = await fetchPage(base, collection, page, token);
    items.push(...(data.items || []));
    if (page >= (data.totalPages || 1)) break;
  }

  return items.map((r) => ({ ...r, _fileBase: `${base}/api/files/${r.collectionId}/${r.id}` }));
}
