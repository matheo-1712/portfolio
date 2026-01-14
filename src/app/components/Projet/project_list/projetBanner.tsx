import Link from "next/link";
import Image from "next/image";
import { ProjetVignetteProps } from "../interface";

const defaultImage = "/citlAI.png";

export default function ProjetBanner({ projects }: ProjetVignetteProps) {
  return (
    <div className="">
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={index} href={`${project.url}`} className="h-full">
              <div
                className="h-full group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:scale-[1.02]"
              >

                {/* Image Section */}
                <div className="relative w-full h-56 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-6 overflow-hidden">
                  {project.pinned && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/50 py-1.5 px-3 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Épinglé</span>
                    </div>
                  )}
                  {Number(project.statut) === 0 && (
                    <div className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 py-1.5 px-3 rounded-full shadow-lg`}>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">✓ Terminé</span>
                    </div>
                  )}
                  <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                    <Image
                      src={project.image || defaultImage}
                      alt={project.nom}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.nom}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {/* Unified Tags Display */}
                    {project.version && (
                      <span className={`px-3 py-1 rounded-full font-medium text-xs border flex items-center gap-1 ${project.isPrerelease
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        }`}>
                        {project.isPrerelease ? "🚧 Beta" : "🚀"} {project.version}
                      </span>
                    )}
                    {project.tags && project.tags.length > 0 ? (
                      project.tags.map((tag, i) => {
                        const isProd = tag === "En Production";
                        const isMaintenu = tag === "Non Maintenu";
                        const isTest = tag === "En phase de test";

                        let activeClasses = "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
                        if (isProd) {
                          activeClasses = "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
                        } else if (isMaintenu) {
                          activeClasses = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
                        } else if (isTest) {
                          activeClasses = "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
                        }

                        return (
                          <span key={i} className={`px-3 py-1 rounded-full font-medium text-xs border flex items-center gap-1.5 ${activeClasses}`}>
                            {isProd && <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>}
                            {isMaintenu && <span className="relative flex h-2 w-2">
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>}
                            {isTest && <span className="relative flex h-2 w-2">
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>}
                            {tag}
                          </span>
                        );
                      })
                    ) : (
                      // Fallback to legacy display if tags not present (though they are guaranteed by Project component now)
                      <>
                        {project.language_prog && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-xs">
                            {project.language_prog}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-500 dark:text-gray-400 font-medium flex justify-between items-center">
                    <span>{project.date_debut} — {project.date_fin}</span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">Aucun projet en cours pour le moment.</p>
      )}
    </div>
  );
}
