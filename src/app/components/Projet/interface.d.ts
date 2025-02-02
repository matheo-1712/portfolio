// Définition de l'interface Project
export type Project = {
    nom: string;
    type: string;
    image: string;
    description: string;
    language_prog: string;
    statut: string;
    repository: string;
    framework: string;
    module: string;
  }

  
export type ProjetVignetteProps = {
  projects: Project[];
};


export interface ProjectProps {
  statut: string;
}