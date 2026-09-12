# Portfolio

Site statique publié sur GitHub Pages. Une page d'index, une fiche par projet,
pas de framework : le build produit du HTML et du CSS directement.

**~48 ko** pour la page d'accueil, avatar compris. Aucune dépendance côté navigateur.

## Comment un projet arrive sur le site

Un dépôt GitHub apparaît sur le portfolio s'il remplit **une** de ces conditions :

1. il porte le **topic `portfolio`** (à poser depuis la page du dépôt, section
   « About » → engrenage → Topics) ;
2. il contient un fichier **`portfolio.md`** à sa racine ;
3. il est listé dans `github.include` de [`data/sources.yml`](data/sources.yml).

Tout le reste est ignoré. C'est volontaire : sans ce filtre, les TP et dépôts
d'exercice noieraient les vrais projets.

## Filtre de contribution

Un dépôt sélectionné n'est retenu que si tu y as réellement commité. Appartenir
à une organisation ne vaut pas contribution : sans ce filtre, les projets des
autres membres remonteraient sur ton portfolio.

```yaml
# data/sources.yml
github:
  requireContribution: true
  minCommits: 1
  identities: ["matheo-1712"]   # à défaut, `users` est utilisé
```

Le nombre de commits est conservé et affiché sur la fiche du projet, toujours
en proportion : « 142 commits sur 300 ». Un dépôt dont tu es le seul
contributeur affiche simplement « 87 commits », la proportion n'ayant alors
rien à apprendre.

Si GitHub ne peut pas répondre (dépôt vide, statistiques en cours de calcul),
**le projet est conservé** : mieux vaut une fiche sans donnée de contribution
qu'un projet disparu à cause d'une API momentanément muette.

## D'où vient le contenu d'un projet

Pour chaque champ, la première source qui répond l'emporte :

| Rang | Source | Sert à |
|---|---|---|
| 1 | `data/overrides.yml` | corriger sans toucher au dépôt d'origine |
| 2 | `portfolio.md` du dépôt | tout décrire à la main |
| 3 | PocketBase | les projets déjà décrits sur antredesloutres.fr |
| 4 | Métadonnées GitHub | description, topics, langages, release, dates |
| 5 | `README.md` nettoyé | résumé de repli et corps de fiche |

Les données vivantes — étoiles, langages, dernière release, date d'activité —
viennent **toujours** de GitHub, seule source à jour.

Voir [`docs/portfolio.md.exemple`](docs/portfolio.md.exemple) pour tous les
champs disponibles.

## Dédoublonnage

Un même projet existe souvent en plusieurs exemplaires : un dépôt personnel, un
dépôt d'organisation, une fiche PocketBase.

- Clé canonique : `owner/repo` en minuscules.
- Une fiche PocketBase est rattachée au dépôt qu'elle déclare ; à défaut, au
  dépôt dont le nom donne le même slug.
- Deux dépôts décrivant le même projet se fusionnent avec `alias_of`
  (dans `data/overrides.yml`). Le dépôt absorbé disparaît de l'index et
  réapparaît sur la fiche de sa cible.

Le sens du lien est déduit des **dates de début**, car une réécriture en cours
est plus récente que le projet qu'elle remplacera :

| Cas | Libellé sur la fiche |
|---|---|
| Le dépôt absorbé est plus ancien | « Version précédente » |
| Plus récent et encore en cours | « Réécriture en cours » |
| Plus récent et publié | « Remplacé par » |

Ajouter `relation: successor` ou `relation: predecessor` à côté de `alias_of`
force le sens quand la déduction se trompe.

## Mise à jour automatique

Le workflow [`deploy.yml`](.github/workflows/deploy.yml) se déclenche :

- tous les jours à 5 h 17 UTC ;
- à chaque push sur `main` ;
- à la demande, depuis l'onglet **Actions** ;
- sur `repository_dispatch` — pour qu'un dépôt prévienne le portfolio dès qu'il
  change, copier [`docs/notify-portfolio.yml`](docs/notify-portfolio.yml) dans
  son dossier `.github/workflows/`.

**Si une source tombe, le site reste publié.** `data/projects.json` est commité
dans le dépôt : quand la collecte échoue (quota GitHub, PocketBase injoignable),
le build repart du dernier fichier valide au lieu de publier une page vide.

## En local

```bash
npm install
npm run collect   # interroge GitHub et PocketBase, écrit data/projects.json
npm run build     # écrit dist/
npm run dev       # build puis sert dist/ sur http://localhost:4173
```

Sans jeton, l'API GitHub est limitée à 60 requêtes par heure — insuffisant pour
relancer `collect` plusieurs fois. Deux solutions :

```bash
export GITHUB_TOKEN=ghp_...   # quota porté à 5000/h
```

Les réponses sont aussi mises en cache une heure dans `.cache/`.
`PORTFOLIO_CACHE=0` le désactive, `PORTFOLIO_CACHE_TTL=86400` allonge sa durée.

## Configuration

| Fichier | Rôle |
|---|---|
| `data/profile.yml` | identité, intro, compétences, formation, expérience |
| `data/sources.yml` | comptes et organisations scannés, topic, inclusions, exclusions |
| `data/overrides.yml` | corrections par projet, alias, masquage |
| `data/projects.json` | **généré** — ne pas éditer à la main |
| `static/` | fichiers copiés tels quels dans `dist/` (le CV, par exemple) |

## Rendu des README

Le corps des fiches est du markdown GitHub rendu au plus près de l'original :

- titres ancrés (`#mon-titre`), pour que les sommaires écrits en markdown marchent ;
- alertes GitHub — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` ;
- listes de tâches `- [x]` / `- [ ]`, listes imbriquées, tableaux à défilement ;
- blocs de code avec le langage en étiquette ;
- `<details>`, `<kbd>`, `<mark>`, citations, séparateurs.

Avant le rendu, le README est nettoyé : badges, titre de niveau 1 répétant le
nom du dépôt, images d'en-tête, et sections « Installation », « Licence »,
« Sommaire », « Crédits »… sont retirées. Ce qui reste décrit le projet.

## Galerie et Modrinth

Un projet publié sur Modrinth voit sa **galerie de captures**, son **icône** et
son **nombre de téléchargements** récupérés automatiquement. Ces informations
n'existent nulle part dans un dépôt GitHub : une capture d'écran de mod vit sur
la page de publication, pas dans le code.

La détection se fait sur les liens du projet (`modrinth.com/mod/<slug>`, ou
`plugin`, `datapack`, `resourcepack`, `shader`, `modpack`). Sinon, déclare le
slug explicitement :

```yaml
# portfolio.md du dépôt, ou data/overrides.yml
modrinth: "cobblemon-trainers-rerebleue"
```

Les images mises en avant sur Modrinth passent en tête, comme sur leur page.
La vignette affichée est la version allégée servie par le CDN ; un clic ouvre
l'original en pleine résolution.

L'icône Modrinth sert de logo quand aucun fichier local n'existe dans
`static/img/projects/`.

### Depuis le dépôt du projet (recommandé)

Dépose les captures dans **`.portfolio/gallery/`** à la racine du dépôt. Rien à
configurer côté portfolio : la collecte les rapatrie et les affiche.

```
mon-projet/
└── .portfolio/
    ├── gallery/
    │   ├── 01-ecran-accueil.png
    │   └── 02-menu.png
    └── gallery.yml          (facultatif, pour les légendes exactes)
```

L'ordre suit les noms de fichiers ; le préfixe numérique le contrôle sans
apparaître dans la légende, déduite du reste du nom
(`01-ecran-accueil.png` → « Ecran accueil »). Pour une légende exacte, liste-la
dans `.portfolio/gallery.yml` :

```yaml
01-ecran-accueil.png: "Page d'accueil, en thème sombre"
```

Les images sont copiées dans `static/img/shots/<slug>/` puis servies par le
site. Une image retirée du dépôt disparaît à la collecte suivante ; une image
inchangée n'est pas retéléchargée.

Détails complets : [`docs/gallery-exemple.md`](docs/gallery-exemple.md).

### Déclarer une galerie à la main

Quand tu ne veux pas toucher au dépôt d'origine — par exemple un dépôt
d'organisation ou un projet scolaire. Cette déclaration est **prioritaire sur
toutes les autres sources**.

Ordre de priorité, la première qui répond l'emporte :
`overrides.yml` → `portfolio.md` → `.portfolio/gallery/` → Modrinth.

Range les images sous `static/img/shots/<projet>/`, puis, dans
`data/overrides.yml` (ou le front-matter du `portfolio.md` du dépôt) :

```yaml
l-antre-des-loutres/otterminded:
  gallery:
    - url: "img/shots/otterminded/accueil.webp"
      title: "Page d'accueil de l'application"
    - url: "img/shots/otterminded/profil.webp"
      title: "Profil utilisateur"
```

La forme courte suffit quand les légendes sont inutiles :

```yaml
  gallery:
    - "img/shots/mon-projet/1.webp"
    - "img/shots/mon-projet/2.webp"
```

**Les chemins sont relatifs à `static/`**, sans barre oblique initiale. Le build
les réécrit pour les fiches, qui vivent dans `/p/`. Une URL absolue
(`https://…`) est utilisée telle quelle.

Champs reconnus par image : `url` (ou `src`, `image`), `title` (ou `caption`),
`description`, et `full` pour pointer une version haute résolution différente
de la vignette.

Les images sont contenues dans un cadre 16/9 sans être rognées : une capture
verticale d'application mobile reste entière, avec des marges latérales.

## État des services

`status` dit où en est le **code**. Il ne dit rien de l'état du **service** :
un projet figé peut tourner depuis des années, un projet actif n'être déployé
nulle part. Les deux sont suivis séparément.

À chaque collecte, les URLs déclarées par un projet sont interrogées. Une URL
qui ne répond plus n'est plus proposée comme lien — ni sur l'index, ni sur la
fiche — et la fiche indique « Service : hors ligne », avec la date de la
dernière réponse connue.

Deux garde-fous :

- **Les plateformes tierces ne sont jamais testées** (GitHub, Discord, Modrinth,
  npm…). Leur disponibilité ne dit rien de ton infrastructure.
- **Une panne passagère ne déclasse pas un service.** La dernière réponse connue
  est conservée dans `projects.json` ; il faut 7 jours sans réponse pour qu'un
  service soit déclaré hors ligne.

Un service n'est surveillé que si son URL est **déclarée** quelque part : le
champ *Website* du dépôt GitHub, une entrée `links:` dans son `portfolio.md`,
ou `data/overrides.yml`. Une URL citée seulement dans le texte d'un README
n'est pas détectée.

```bash
npm run health   # vérifie les services sans toucher au quota GitHub
```

## Notes (articles)

Un fichier markdown dans `content/notes/` devient un article publié à
`/n/<slug>.html`, listé sur la page d'accueil. Rien à collecter, rien à
configurer.

```markdown
---
title: "Ma stack"
summary: "Ce que j'utilise au quotidien, et pourquoi."
date: 2026-09-12
tags: [Rust, TypeScript]
draft: true      # invisible en ligne, visible en local
---

Le corps de l'article, en markdown.
```

Les articles sont triés du plus récent au plus ancien, et le temps de lecture
est calculé automatiquement. Un article marqué `draft: true` n'est publié ni
sur l'index ni en page : pour le relire avant publication,
`NODE_ENV=development npm run build`.

## Visuels

Tout est facultatif — un projet sans image reçoit un monogramme dont la couleur
est dérivée de son nom, stable d'un build à l'autre.

| Fichier | Où il apparaît | Format conseillé |
|---|---|---|
| `static/img/avatar.*` | en-tête de la page d'accueil | carré, 144 px |
| `static/img/projects/<slug>.*` | **logo** du projet, index et fiche | carré, 96 px |
| `static/img/banners/<slug>.*` | bandeau large de la fiche projet | 900 px, ratio ≥ 2,5 |

Extensions acceptées, dans cet ordre : `webp`, `png`, `svg`, `jpg`, `jpeg`.
Le `<slug>` est celui du projet dans `data/projects.json`. Déposer le fichier
suffit : le build le détecte au prochain passage, aucune configuration.

Pour alléger un logo avant de le déposer (un PNG de logo pèse souvent 100 ko
là où 3 suffisent) :

```bash
python scripts/add-logo.py mon-logo.png cobblemon-trainers
```

Le script recadre au carré, redimensionne en 96 px et écrit le WebP au bon
endroit. Il n'est pas obligatoire — déposer le fichier à la main fonctionne.

Sans logo, le projet reçoit un monogramme (« OT » pour Otterbots) dont la teinte
est dérivée de son nom. Un logo peut aussi être déclaré par URL avec `image:`
dans le `portfolio.md` du dépôt ou dans `data/overrides.yml` — le fichier local
l'emporte quand les deux existent.

Les couleurs des technologies (pastilles et barre de répartition) viennent de
`src/lib/colors.mjs` — les teintes de GitHub Linguist pour les langages, les
couleurs de marque pour les frameworks. Une techno inconnue reste grise ;
ajoute-la dans ce fichier pour lui donner sa couleur.

## PocketBase

La collection `projects` doit être lisible pour être collectée. Au choix :

- ouvrir sa règle de **List/Search** dans l'admin PocketBase (par exemple
  `published = true`) — aucun secret à gérer ;
- ou renseigner les secrets `PB_EMAIL` / `PB_PASSWORD` dans les paramètres
  Actions du dépôt.

Sans l'un ou l'autre, la source est simplement ignorée avec un avertissement.
