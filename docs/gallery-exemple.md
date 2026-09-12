# Declarer une galerie depuis un depot

Depose tes captures dans un dossier `.portfolio/gallery/` a la racine du depot.
Rien d'autre a faire : la prochaine collecte les rapatrie et les affiche sur la
fiche du projet.

```
mon-projet/
├── .portfolio/
│   ├── gallery/
│   │   ├── 01-ecran-accueil.png
│   │   ├── 02-menu-navigation.png
│   │   └── 03-combat.webp
│   └── gallery.yml        (facultatif)
├── portfolio.md           (facultatif)
├── README.md
└── src/
```

## Ordre des images

L'ordre est celui des noms de fichiers. Le prefixe numerique sert a le
controler et n'apparait pas dans la legende.

## Legendes

Par defaut, la legende vient du nom du fichier :

| Fichier | Legende affichee |
|---|---|
| `01-ecran-accueil.png` | Ecran accueil |
| `02_menu_navigation.jpg` | Menu navigation |
| `combat-de-dresseur.webp` | Combat de dresseur |

Pour des legendes exactes (accents, ponctuation, phrases), ajoute un
`.portfolio/gallery.yml` :

```yaml
01-ecran-accueil.png: "Page d'accueil, en thème sombre"
02-menu-navigation.png: "Menu latéral avec les raccourcis"
03-combat.webp: "Un combat contre un dresseur personnalisé"
```

Les fichiers non listes gardent la legende deduite de leur nom.

## Formats acceptes

`png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`. Tout autre fichier du dossier
(README, .gitkeep...) est ignore.

Prefere des images de 900 a 1600 px de large : elles sont rapatriees telles
quelles dans le portfolio, et une capture de 4 Mo alourdit le depot pour rien.

## Ce qui se passe ensuite

Les images sont copiees dans `static/img/shots/<slug>/` du portfolio, puis
publiees avec le site. Elles sont donc servies par GitHub Pages, pas par
raw.githubusercontent.

Une image retiree du depot disparait du portfolio a la collecte suivante.
Une image inchangee n'est pas retelechargee.
