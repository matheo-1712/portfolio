"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";

import Keywords from "@/app/components/Projet/project_informations/keywords";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import TitleProject from "@/app/components/Projet/project_informations/title_project";
import GalleryZoomImage from "@/app/components/Image/galleryZoomImage";

const images = [
    { src: "/img/project/portfolio/accueil_clair.png", caption: "Page d'accueil de l'application (mode clair)" },
    { src: "/img/project/portfolio/accueil_sombre.png", caption: "Page d'accueil de l'application (mode sombre)" },
    { src: "/img/project/portfolio/projet_clair.png", caption: "Page de présentation de mes projets (mode clair)" },
    { src: "/img/project/portfolio/projet_sombre.png", caption: "Page de présentation de mes projets (mode sombre)" },
    { src: "/img/project/portfolio/projet_mobile.png", caption: "Page de présentation de mes projets (mode mobile clair)" },
    { src: "/img/project/portfolio/projet_mobile2.png", caption: "Page de présentation de mes projets (mode mobile sombre)" },
    { src: "/img/project/portfolio/zoom_image.png", caption: "Quand on clique sur une image, elle s'agrandit" },
];

export default function Projet_Portfolio() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(3).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["Next.js", "React", "Site vitrine", "Responsive"]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                        <p>Voici la page de présentation de la structure de mon portfolio, dont l&apos;objectif est de mettre en valeur mon travail et de partager mes compétences.</p>
                        <br />
                        <p>Développé avec <strong>Next.js</strong> et utilisant la technologie <strong>React</strong>, il permet de créer des pages statiques, rapides et dynamiques.</p>
                        <br />
                        <p>Ce portfolio a pour objectif d&apos;être le plus simple possible tout en restant moderne et complet. Il est donc composé de pages statiques, sans aucune interaction utilisateur. Les pages les plus importantes sont donc la page d&apos;accueil et celle de mes projets.</p>
                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
                        <p>Voici les principales fonctionnalités de mon portfolio :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Page d&apos;accueil</li>
                            <li>Page de présentation de mes projets</li>
                        </ul>

                    </div>
                </div>

                <div id="apercu" className="my-6">
                    <TitleProject title="Aperçu de l&apos;application" />

                    <GalleryZoomImage images={images} />
                </div>
            </div>
        </div >
    );
}
