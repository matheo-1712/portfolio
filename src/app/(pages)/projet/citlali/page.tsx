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

export default function Projet_Citlali() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(1).then(data => setProjectInfos(data));
    }, []);

    const images = [
        { src: "/img/project/citlali/infographies.png", caption: "Commande /build [nom du personnage]" },
        { src: "/img/project/citlali/autocompletion.png", caption: "Système d'autocomplétion" },
        { src: "/img/project/citlali/profil.png", caption: "Profil de l'utilisateur via la commande /get-uid" },

    ];

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["Discord", "Projet personnel", "Application", "Bot"]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                        <p>Citlali est un bot Discord conçu pour les joueurs de <strong>Genshin Impact</strong>.</p>
                        <br />
                        <p>Développé avec le module <strong>discord.js</strong> , il permet d&apos;automatiser diverses fonctionnalités au sein de Discord.</p>
                        <br />
                        <p>Son objectif est d’aider les utilisateurs à optimiser leurs personnages, à enregistrer et partager leur <strong>UID</strong>, et bientôt à accéder facilement aux informations sur les événements à venir. De nombreuses autres fonctionnalités sont également prévues. Ce projet, réalisé sur mon temps libre (<i>et par plaisir</i>), n&apos;est pas une priorité de développement et n&apos;a donc pas de date limite prévue.</p>
                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
                        <p>Voici les principales fonctionnalités de Citlali :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Enregistrement et partage de l&apos;UID des utilisateurs</li>
                            <li>Aide à l&apos;optimisation des personnages via l&apos;affichage d&apos;infographies récupérées à partir d&apos;un site de guide <strong>Keqing Mains</strong></li>
                            <li>Affichage des informations des personnages</li>
                        </ul>

                    </div>
                </div>

                <div id="db_schema" className="my-6">
                    <TitleProject title="Schéma base de données" />

                    <ZoomImage src="/db_schema/citlali.svg" />
                </div>

                <div id="apercu" className="my-6">
                    <TitleProject title="Aperçu de l&apos;application" />

                    <GalleryZoomImage images={images} />
                </div>

                <div id="Test">
                    <TitleProject title="Tester l'application" />
                    <div id="text" className="my-6">
                        <div id="text" className="my-6">
                            <p>Ce bot Discord est disponible en version stable et peut être installé et utilisé sur votre serveur Discord via ce lien : <Link className="text-blue-600 font-semibold hover:underline" href={"https://discord.com/oauth2/authorize?client_id=1300834433221267549&permissions=0&integration_type=0&scope=bot"}>ici</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
