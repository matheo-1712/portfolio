import { ProjetVignetteProps } from "../interface";

export default function ProjetBanner({ projects }: ProjetVignetteProps) {
  return (
    <div>
      <ul className="flex flex-col gap-4 p-4">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <li key={index}>
              <h2 className="text-2xl font-bold">{project.nom}</h2>
              <p className="text-lg">{project.description}</p>
              <p><strong>Langage :</strong> {project.language_prog}</p>
              <p><strong>Framework :</strong> {project.framework}</p>
            </li>
          ))
        ) : (
          <p>Aucun projet en cours.</p>
        )}
      </ul>
    </div>
  );
}
