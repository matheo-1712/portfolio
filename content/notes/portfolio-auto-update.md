---
title: "Un portfolio qui se met à jour tout seul"
summary: "Trois sources de projets, des doublons partout, et l'envie de ne plus jamais éditer une fiche à la main."
date: 2026-09-12
tags: [Node.js, GitHub Actions, architecture]
---

Mes projets vivaient à trois endroits à la fois : mes dépôts GitHub personnels,
ceux de l'organisation L'Antre des Loutres, et une base PocketBase qui alimente
la page projets de notre site communautaire.

Résultat : le même projet existait en quatre exemplaires. Otterbots, par
exemple, avait un dépôt perso, un dépôt d'organisation, une fiche PocketBase
et une fiche MDX dans mon ancien portfolio. À chaque nouvelle version, il
fallait penser à mettre à jour quatre endroits. Autant dire que je n'y pensais
jamais.

## Le vrai problème n'était pas les doublons

En listant mes dépôts, j'en ai compté une cinquantaine. Plus de la moitié sont
des TP : `TP3-2`, `TP-Formulaire`, `Lolo-Java`, `Initiation-Rust`. Utiles pour
apprendre, sans aucun intérêt sur un portfolio.

Un système qui aspire automatiquement tous les dépôts aurait noyé les quinze
projets qui comptent sous trente-cinq exercices scolaires. L'automatisation
naïve aurait produit un résultat pire que la liste écrite à la main.

## Le déclencheur : un topic GitHub

La règle est devenue simple. Un dépôt n'apparaît sur le portfolio que s'il
porte le topic `portfolio`, ou s'il contient un fichier `portfolio.md`.

Le topic se pose en deux clics depuis l'interface GitHub, sans commit, sans
toucher au code. C'est devenu mon interrupteur : un projet est prêt à être
montré, je coche ; il ne l'est plus, je décoche.

## Une cascade, pas une source unique

Chaque champ d'un projet vient de la première source qui sait répondre :

| Rang | Source | Rôle |
|---|---|---|
| 1 | `overrides.yml` | corriger sans toucher au dépôt d'origine |
| 2 | `portfolio.md` | tout décrire à la main, quand ça vaut le coup |
| 3 | PocketBase | les projets déjà documentés côté communauté |
| 4 | Métadonnées GitHub | description, topics, langages, release |
| 5 | `README.md` nettoyé | résumé de repli |

Le point important est le cinquième étage. Un README est écrit pour GitHub :
il commence par une bannière, une rangée de badges, un sommaire, et se termine
par les instructions d'installation et la licence. Rien de tout cela n'a sa
place sur un portfolio.

Le collecteur retire donc les badges, le titre de niveau 1 qui répète le nom du
dépôt, les images d'en-tête, et toutes les sections dont le titre ressemble à
« Installation », « Licence » ou « Sommaire ». Ce qui reste est la description
du projet — exactement ce que je veux afficher.

## Ce qui se passe quand une source tombe

C'est la partie que j'ai le plus soignée, parce que c'est celle qui casse en
premier.

L'API GitHub limite les requêtes anonymes à soixante par heure. PocketBase peut
être injoignable. Si la collecte échoue et que le build publie ce qu'il a —
c'est-à-dire rien — le portfolio devient une page vide.

Le fichier `projects.json` produit par la collecte est donc **commité dans le
dépôt**. Quand une source ne répond pas, l'étape de collecte échoue sans
interrompre le workflow, et le build repart du dernier fichier valide. Le site
reste en ligne avec des données de la veille, ce qui est infiniment préférable
à une page blanche.

## Le résultat

Une action GitHub tourne chaque matin, rassemble les trois sources, fusionne
les doublons sur la clé `owner/repo`, et republie le site. Le tout produit une
page d'environ cinquante kilooctets, sans framework et sans dépendance côté
navigateur.

Je n'ai plus à mettre à jour mon portfolio. Je pousse du code, et il suit.
