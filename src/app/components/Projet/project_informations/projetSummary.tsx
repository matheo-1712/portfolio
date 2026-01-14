import Link from "next/link";
import { Project } from "../interface";


export default function ProjetSummary(projectInfos: Project) {

    // Status mapping with styles
    const getStatusStyle = (status: number) => {
        switch (Number(status)) {
            case 0: return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"; // Terminé
            case 1: return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"; // En cours
            case 2: return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"; // Futur
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusLabel = (status: number) => {
        switch (Number(status)) {
            case 0: return "Terminé";
            case 1: return "En cours";
            case 2: return "Futur";
            default: return "Inconnu";
        }
    };

    return (
        <div id={projectInfos.nom} className="w-full mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transform transition-all hover:shadow-lg duration-500">
            {/* Header / Banner area could go here if we had a cover image, for now just padding */}
            <div className="p-8 md:p-10">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                        {projectInfos.nom}
                    </h2>
                    <div className="flex items-center gap-3">
                        {projectInfos.version && (
                            <Link
                                href={`${projectInfos.repository}/releases/tag/${projectInfos.version}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-4 py-1.5 rounded-full text-sm font-bold border hover:shadow-md transition-shadow cursor-pointer flex items-center gap-2 ${projectInfos.isPrerelease
                                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                    }`}
                                title="Voir la release sur GitHub"
                            >
                                <span>{projectInfos.isPrerelease ? "🚧" : "🚀"}</span>
                                <span>{projectInfos.isPrerelease ? "Beta " : ""}{projectInfos.version}</span>
                            </Link>
                        )}
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(Number(projectInfos.statut))}`}>
                            {getStatusLabel(Number(projectInfos.statut))}
                        </span>
                    </div>
                </div>

                {projectInfos ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

                        <div className="space-y-6">
                            <InfoRow label="Type" value={projectInfos.type} icon="🛠️" />
                            <InfoRow label="Framework" value={projectInfos.framework} icon="💻" />
                            <InfoRow label="Module" value={projectInfos.module} icon="📦" />
                        </div>

                        <div className="space-y-6">
                            <InfoRow label="Langage(s)" value={projectInfos.language_prog} icon="🔤" />
                            <InfoRow label="Période" value={`${projectInfos.date_debut} - ${projectInfos.date_fin}`} icon="📅" />

                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50">
                                <span className="mt-1">🔗</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repository</span>
                                    <Link href={projectInfos.repository} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline break-all">
                                        {projectInfos.repository.replace('https://github.com/', '')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Description</span>
                            {projectInfos.description}
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ label, value, icon }: { label: string, value: string, icon: string }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 text-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
            </div>
        </div>
    );
}