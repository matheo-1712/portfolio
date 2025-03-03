"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import Link from "next/link";

export default function Projet_Portfolio() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(1).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div id="api-serveur-v2" className="w-full mx-auto p-10 shadow-2xl rounded-2xl border border-gray-300">
                <h2 className="text-2xl font-bold mb-6 text-center">🚀 Détails du projet</h2>
                {projectInfos ? (
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-left"><span className="font-semibold">📌 Nom :</span> {projectInfos.nom}</p>
                        <p className="text-right"><span className="font-semibold">🛠️ Type :</span> {projectInfos.type}</p>
                        <p className="text-left"><span className="font-semibold">📊 Statut :</span> {projectInfos.statut}</p>
                        <p className="text-right"><span className="font-semibold">💻 Framework :</span> {projectInfos.framework}</p>
                        <p className="text-left"><span className="font-semibold">📦 Module :</span> {projectInfos.module}</p>
                        <p className="text-right"><span className="font-semibold">🔤 Langage(s) :</span> {projectInfos.language_prog}</p>
                        <p className="text-left"><span className="font-semibold">📅 Début :</span> {projectInfos.date_debut}</p>
                        <p className="text-right"><span className="font-semibold">🏁 Fin :</span> {projectInfos.date_fin}</p>
                        <p className="col-span-2"><span className="font-semibold">📝 Description :</span> {projectInfos.description}</p>
                        <p className="col-span-2 text-center">
                            <span className="font-semibold">🔗 Repository :</span> 
                            <Link href={projectInfos.repository} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                                {projectInfos.repository}
                            </Link>
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">⏳ Chargement des informations du projet...</p>
                )}
            </div>
        </div>
    );
}
