import Link from "next/link";
import { Project } from "../interface";


export default function ProjetSummary(projectInfos: Project) {

// Label project Satut
const projectStatus: { [key: number]: string } = { 0: "✅ Terminé", 1:"🟢 En cours",  2: "🗒️ Futur" };

    return (
        <div id={projectInfos.nom} className="w-full mx-auto p-10 shadow-2xl rounded-2xl border border-gray-300 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">🚀 Détails du projet</h2>
            {projectInfos ? (
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-left"><span className="font-semibold">📌 Nom :</span> {projectInfos.nom}</p>
                    <p className="text-right"><span className="font-semibold">🛠️ Type :</span> {projectInfos.type}</p>
                    <p className="text-left"><span className="font-semibold">📊 Statut :</span> {projectStatus[Number(projectInfos.statut)] ?? projectInfos.statut}</p>
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

    );
}