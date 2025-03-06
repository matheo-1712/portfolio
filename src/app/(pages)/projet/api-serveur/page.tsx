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
        projectFetchById(6).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["API", "Serveur"]} />
                <div id="Project-description">
                    <TitleProject title="Descriptif du projet" />

                    <div id="text" className="my-6">

                        <p><strong>API-Serveur</strong> est une application web de type API REST qui permet de gérer les serveurs de jeu de l&apos;Antre des Loutres.</p>
                        <br />
                        <p>Vous pouvez accéder à l&apos;API à l&apos;adresse suivante :
                            <Link href="https://api.antredesloutres.fr/" className="text-blue-600 font-semibold hover:underline"> https://api.antredesloutres.fr/</Link>
                        </p>
                        <br />
                        <p>Cette API permet de gérer les serveurs de jeu en affichant toutes les informations relatives à chacun d&apos;eux, ainsi qu&apos;en offrant la possibilité de les installer, démarrer ou arrêter via des requêtes simples.</p>
                        <br />
                        <p>
                            ❗Ce projet a pour suite une refonte complète en TypeScript, avec l&apos;ajout de nouvelles fonctionnalités et des optimisations. Il ne sera donc plus mis à jour.
                        </p>
                    </div>
                </div>

                <div id="Fonctionnalités">
                    <TitleProject title="Fonctionnalités" />
                    <div id="text" className="my-6">
                        <p>Voici les principales fonctionnalités de l&apos;API-Serveur :</p>
                        <br />
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Afficher les informations générales des serveurs (addresses, ports, version, utilisateurs connectés, etc.)</li>
                            <li>Installation de nouveau serveur de jeu</li>
                            <li>Gérer le démarrage et l&apos;arrêt des serveurs</li>
                            <li>Mettre à jour les informations des serveurs</li>
                            <li>Supprimer un serveur de jeu</li>
                            <li>Enregistrement des comptes des utilisateurs</li>
                            <li>Protection des requêtes de création, modification, suppression de serveurs, lancement et arrêt de serveurs par un token</li>
                        </ul>
                    </div>
                </div>

                <div id="Lexique">
                    <TitleProject title="Lexique" />
                    <div id="text" className="my-6">
                        <p>Voici le lexique de l&apos;API-Serveur :</p>
                        <br />
                        <p><strong>Les serveurs primaire et secondaire</strong> font référence aux différents emplacements (slots) et aux ports associés pour héberger des serveurs de jeu. Le serveur principal, qui est toujours actif et permanent, est assigné au <strong>slot primaire</strong>, tandis que les serveurs utilisés pour des événements temporaires ou spécifiques sont placés sur le <strong>slot secondaire</strong>.</p>
                        <br />
                        <p><strong>Les &quot;investisseurs&quot;</strong> sont des utilisateurs de nos services qui ont financé les frais d&apos;hébergement et de maintenance des serveurs de jeu. Ils possèdent donc des droits supplémentaires, tels que la possibilité de créer leur propre serveur de jeu, qui sera référencé dans la table <strong>investisseurs</strong>.</p>
                    </div>
                </div>


                <div id="db_schema" className="my-6">
                    <TitleProject title="Schéma base de données" />

                    <ZoomImage src="/db_schema/api_serveur.svg" />
                </div>

                <div id="Test">
                    <TitleProject title="Tester l&apos;API" />

                    <div id="text" className="my-6">
                        <p>Voir la liste des serveurs : <Link href="https://api.antredesloutres.fr/serveurs" className="text-blue-600 font-semibold hover:underline">https://api.antredesloutres.fr/serveurs</Link></p>
                        <br />
                        <p>Voir les informations d&apos;un serveur particulier : <Link href="https://api.antredesloutres.fr/serveurs/infos/1" className="text-blue-600 font-semibold hover:underline">https://api.antredesloutres.fr/serveurs/infos/1</Link></p>
                    </div>

                </div>
            </div>
        </div >
    );
}
