"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import ZoomImage from "@/app/components/Image/zoomImage";
import TitleProject from "@/app/components/Projet/project_informations/title_project";
import Link from "next/link";

export default function Projet_apiServeur() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(8).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["Antre des loutres", "Site web", "Astro", "Projet personnel", "Projet de groupe"]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                        <p><strong>Astroloutre</strong> est une application web de type site static permet l&#39;affichage des informations des serveurs des statistiques des joueurs sur nos serveurs de Jeu.</p>
                        <br />
                        <p>Vous pouvez accéder à ce site à l&apos;adresse suivante :
                            <Link href="https://antredesloutres.fr/" className="text-blue-600 font-semibold hover:underline"> https://antredesloutres.fr</Link>
                        </p>
                        <br />
                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
                        <p>Voici les principales fonctionnalités d&#39;Astroloutre :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Affichage des serveurs disponibles</li>
                            <li>Affichage des statistiques de jeu</li>
                        </ul>
                    </div>
                </div>
                
                <div id="Test">
                    <TitleProject title="Tester le site" />

                    <div id="text" className="my-6">
                        <p>Voir la page d&#39;accueil : <Link href="https://antredesloutres.fr" className="text-blue-600 font-semibold hover:underline">https://antredesloutres.fr</Link></p>
                        <br />
                    </div>

                </div>
            </div>
        </div >
    );
}
