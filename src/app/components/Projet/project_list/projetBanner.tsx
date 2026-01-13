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
                    <div className="absolute top-4 right-4 z-10 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/50 p-2 rounded-full shadow-lg" title="Projet épinglé">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
                    {project.language_prog && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-xs">
                        {project.language_prog}
                      </span>
                    )}
                    {project.framework && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-xs">
                        {project.framework}
                      </span>
                    )}
                    {project.module && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium text-xs">
                        {project.module}
                      </span>
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
