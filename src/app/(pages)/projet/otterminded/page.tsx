"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import ZoomImage from "@/app/components/Image/zoomImage";
import TitleProject from "@/app/components/Projet/project_informations/title_project";
import Link from "next/link";

export default function Projet_Otterminded() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(5).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <Keywords keywords={["API", "Serveur"]} />
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

                <div id="db_schema">
                    <TitleProject title="Schéma base de données" />

                    <ZoomImage src="/db_schema/otterminded.svg" />
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

