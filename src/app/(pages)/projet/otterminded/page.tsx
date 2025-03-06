"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import ZoomImage from "@/app/components/Image/zoomImage";
import TitleProject from "@/app/components/Projet/project_informations/title_project";
import Link from "next/link";
import GalleryZoomImage from "@/app/components/Image/galleryZoomImage";

const images = [
    { src: "/img/project/otterminded/accueil.png", caption: "Page d'accueil de l'application (mode clair)" },
    { src: "/img/project/otterminded/navbar.png", caption: "Menu de navigation de l'application" },
    { src: "/img/project/otterminded/profil.png", caption: "Page profil de l'application" },
    { src: "/img/project/otterminded/adminpanel_commentaire.jpg", caption: "Page commentaire sur le panel Admin" },
    { src: "/img/project/otterminded/adminpanel_question.jpg", caption: "Page question sur le panel admin" },
    { src: "/img/project/otterminded/adminpanel_utilisateur.jpg", caption: "Page utilisateur sur le panel admin" },
];


export default function Projet_Otterminded() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(5).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["Android", "Mobile", "Kotlin", "Réseau social anonyme", "Projet scolaire", "Projet de groupe"]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                        <p><strong>« Otter Minded »</strong> <i>Jeu de mot sur le terme anglais Open-Minded (Ouvert d&apos;esprit), en remplaçant &quot;Open&quot; (ouvert) par &quot;Otter&quot; (loutre)</i>, est une application mobile social et anonyme qui à pour but de partager son avis sur différentes questions proposer par les utilisateurs. Ce projet étant un projet scolaire et un projet de groupe, nous avons dû respecter certaines contraintes, notamment l&apos;obligation que notre application fonctionne exclusivement en local.</p>
                        <br />
                        <p>Chaque questions possède son nombre de « like » et son espace commentaire libre, permettant aux utilisateur de répondre aux question et donner leur avis sur un dis sujet.</p>
                        <br />
                        <p>Les questions proposés, avant d’être dévoilé aux utilisateurs, passe par un stade de modération, ou elle sont vérifier afin d’éviter de proposer des questions inapproprié.</p>
                        <br />
                        <p>Pour finir, l’espace commentaire peut être modéré afin de contrôler les commentaires et garder un espace de partage et bienveillance.</p>


                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
                        <p>Voici les principales fonctionnalités de l&apos;API-Serveur :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Connexion des utilisateurs sans informations personnelles (juste login & mot de passe)</li>
                            <li>Statistiques utilisateur : nombre de commentaires, nombre de questions, nombre de likes aux questions</li>
                            <li>4 questions par jour</li>
                            <li>Proposition de questions par les utilisateurs (max 1 toutes les 24h par utilisateur)</li>
                            <li>Système de like pour les questions</li>
                            <li>Notification à chaque nouvelle question</li>
                            <li>Historique des questions et commentaires</li>
                            <li>Statut des questions : en attente, vérifié</li>
                            <li>Suppression des questions refusées avec notification à l’utilisateur</li>
                            <li>Espace commentaire pour chaque question</li>
                            <li>Modération des commentaires par les administrateurs et modérateurs</li>
                        </ul>
                    </div>
                </div>

                <div id="Organisation">
                    <TitleProject title="Organisation" />
                    <div id="text" className="my-6">
                        <p>Dans le cadre de notre projet de groupe, nous avons choisi de nous organiser selon la méthodologie SCRUM afin de garantir une gestion efficace et une progression harmonieuse tout au long du développement. La méthode SCRUM nous a permis de structurer nos efforts, de rester alignés sur les objectifs du projet et de favoriser une collaboration active au sein de l’équipe. Voici les principaux éléments de notre organisation :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Un tableau collaboratif Trello est mis à disposition de tous les membres de l’équipe pour organiser les tâches et suivre l’avancement du projet. Ce tableau est accessible à tout moment et peut être consulté à l’adresse suivante : <Link href={"https://trello.com/b/4kI6N7vs"} className="text-blue-600 font-semibold hover:underline">ici</Link></li>
                            <li>Nous avons mis en place des réunions régulières avant chaque sprint. Ces réunions ont pour objectif de faire le point sur l&apos;avancement des tâches en cours, de clarifier les priorités à venir et de réajuster les objectifs si nécessaire, afin de garantir que tout le monde soit aligné sur la direction à prendre.</li>
                            <li>Des réunions de fin de sprint sont également organisées pour analyser les résultats du sprint précédent, discuter des éventuels défis rencontrés, et déterminer les améliorations à apporter. Lors de ces réunions, nous prévoyons également les objectifs pour le sprint suivant, en prenant en compte les retours et les ajustements nécessaires pour optimiser notre productivité.</li>
                            <li>De plus, chaque membre de l’équipe a la possibilité de proposer des améliorations pour les fonctionnalités, ce qui contribue à renforcer l’efficacité collective et à améliorer la gestion de projet au fur et à mesure de son avancement.</li>
                        </ul>
                        <br />
                        <p>Cette organisation nous a permis de mieux structurer notre travail, de respecter les délais impartis et d&apos;assurer une communication fluide et constante entre tous les membres de l’équipe, en facilitant le suivi des tâches et l&apos;adaptation aux besoins du projet.</p>
                    </div>
                </div>


                <div id="db_schema" className="my-6">
                    <TitleProject title="Schéma base de données" />

                    <ZoomImage src="/db_schema/otterminded.svg" />
                </div>

                <div id="apercu" className="my-6">
                    <TitleProject title="Aperçu de l&apos;application" />

                    <GalleryZoomImage images={images} />
                </div>

                <div id="Test">
                    <TitleProject title="Tester l'application" />
                    <div id="text" className="my-6">
                        Un apk de l&apos;application est disponible pour les personnes souhaitant tester l&apos;application via ce lien : <Link href="https://github.com/L-Antre-des-Loutres/OtterMinded/releases/tag/v1.0.0" className="text-blue-600 font-semibold hover:underline">OtterMinded APK</Link>
                    </div>
                </div>
            </div>
        </div >
    );
}

