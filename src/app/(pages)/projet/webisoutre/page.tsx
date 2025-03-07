"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import ZoomImage from "@/app/components/Image/zoomImage";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import TitleProject from "@/app/components/Projet/project_informations/title_project";
import Link from "next/link";
import GalleryZoomImage from "@/app/components/Image/galleryZoomImage";

export default function Projet_Webisoutre() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(7).then(data => setProjectInfos(data));
    }, []);

    const images = [
        { src: "/img/project/otterminded/accueil.png", caption: "Page d'accueil de l'application (mode clair)" },
        { src: "/img/project/otterminded/navbar.png", caption: "Menu de navigation de l'application" },
        { src: "/img/project/otterminded/profil.png", caption: "Page profil de l'application" },
        { src: "/img/project/otterminded/adminpanel_commentaire.jpg", caption: "Page commentaire sur le panel Admin" },
        { src: "/img/project/otterminded/adminpanel_question.jpg", caption: "Page question sur le panel admin" },
        { src: "/img/project/otterminded/adminpanel_utilisateur.jpg", caption: "Page utilisateur sur le panel admin" },
    ];


    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={[]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
            
                    </div>
                </div>

                <div id="Organisation">
                    <TitleProject title="Organisation" />
                    <div id="text" className="my-6">
                        <p>Dans le cadre de notre projet de groupe, nous avons choisi de nous organiser selon la méthodologie SCRUM afin de garantir une gestion efficace et une progression harmonieuse tout au long du développement. La méthode SCRUM nous a permis de structurer nos efforts, de rester alignés sur les objectifs du projet et de favoriser une collaboration active au sein de l’équipe. Voici les principaux éléments de notre organisation :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Un tableau collaboratif Trello est mis à disposition de tous les membres de l’équipe pour organiser les tâches et suivre l’avancement du projet. Ce tableau est accessible à tout moment et peut être consulté à l’adresse suivante : <Link href={"https://trello.com/b/DvDpwyC1/webisoutre"} className="text-blue-600 font-semibold hover:underline">ici</Link></li>
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
                        Ce site est accessible sur l&apos;url suivante : <Link href="https://webisoutre.antredesloutres.site" className="text-blue-600 font-semibold hover:underline">https://webisoutre.antredesloutres.site</Link>
                    </div>
                </div>
            </div>
        </div >
    );
}


