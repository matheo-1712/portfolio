---
title: "Ma stack"
summary: "Ce que j'utilise au quotidien, et pourquoi."
date: 2026-09-12
tags: [stack, Rust, TypeScript]
draft: true
---

<!--
  BROUILLON — ce fichier ne sera pas publié tant que `draft: true` est présent
  dans le front-matter ci-dessus. Retire cette ligne quand tu es prêt.

  La structure et les faits techniques viennent de tes projets réels.
  Les raisons, elles, sont à écrire : c'est ce qui rend un article intéressant,
  et personne ne peut les écrire à ta place. Les questions en commentaire sous
  chaque section sont là pour t'aider à démarrer.
-->

## Backend : TypeScript et Rust

La majorité de mes projets tournent en TypeScript — Otterbots, Arisoutre,
Mineotter, CitlAPI. Depuis 2026, je bascule une partie de l'infrastructure
vers Rust : OAPI, l'API d'orchestration de la communauté, est écrite avec Axum.

<!--
  À écrire :
  - Qu'est-ce qui t'a décidé à passer à Rust sur OAPI plutôt que de continuer
    en TypeScript comme pour OtterlyApi ?
  - Qu'est-ce que tu as gagné concrètement ? Qu'est-ce que tu as perdu ?
  - Est-ce que tu recommencerais ?
-->

## Un framework maison pour les bots

Après avoir écrit plusieurs bots Discord, la même plomberie revenait à chaque
fois : gestion des événements, enregistrement des commandes, connexion à
l'API. D'où Otterbots, une surcouche à Discord.js qui propulse aujourd'hui
l'ensemble de nos bots.

<!--
  À écrire :
  - À partir de combien de bots est-ce que le framework est devenu rentable ?
  - Qu'est-ce que tu as sur-conçu au début et que tu as fini par retirer ?
  - Le module OtterGuard (anti-scam, anti-spam) : qu'est-ce qui t'a poussé à
    l'écrire ? Un incident précis ?
-->

## Infrastructure

Linux, Docker, Nginx. Les serveurs de jeu, les bots et les APIs tournent sur
la même infrastructure, pilotée par nos propres outils.

<!--
  À écrire :
  - Comment tu déploies aujourd'hui ? Qu'est-ce qui était manuel avant ?
  - La chose que tu aurais aimé savoir en montant la première machine.
-->

## Ce que je regarde en ce moment

<!--
  À écrire : une ou deux technos que tu explores, et la question concrète que
  tu te poses à leur sujet. C'est souvent la section que les gens lisent en
  premier, parce qu'elle dit où tu vas plutôt que d'où tu viens.
-->
