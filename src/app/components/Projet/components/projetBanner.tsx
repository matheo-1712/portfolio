import Link from "next/link";
import Image from "next/image";
import { ProjetVignetteProps } from "../interface";

const defaultImage = "/citlali.png";

export default function ProjetBanner({ projects }: ProjetVignetteProps) {
  return (
    <div className="">
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={index} href={`${project.url}`}>
              <div
                key={index}
                className="group shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col justify-between
      min-h-[410px] sm:min-h-[410px] md:min-h-[410px] lg:min-h-[410px] sm:min-h-[450px] hover:bg-gray-900 
      transition-all duration-300 ease-in-out"
              >
                <div>
                  <div className="relative w-full h-full pb-4 min-h-[150px] flex items-center justify-center">
                    <div className="relative w-[600px] h-[200px]">
                      <Image
                        src={project.image || defaultImage}
                        alt={project.nom}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{project.nom}</h2>

                  {/* Description affichée par défaut sur 2 lignes */}
                  <p
                    className="text-lg mb-2 line-clamp-none md:line-clamp-2 group-hover:line-clamp-none transition-all duration-300 ease-in-out"
                  >
                    {project.description}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Langage :</strong> {project.language_prog}
                  </p>
                  <div className="flex flex-wrap gap-7 text-sm text-gray-600">
                    {project.framework && (
                      <p>
                        <strong>Framework :</strong> {project.framework}
                      </p>
                    )}
                    {project.module && (
                      <p>
                        <strong>Module :</strong> {project.module}
                      </p>
                    )}
                  </div>
                  <br />
                  <div id="date">
                    <p className="text-sm text-gray-600">
                    Début : {project.date_debut} | Fin : {project.date_fin}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun projet en cours.</p>
      )}
    </div>
  );
}
