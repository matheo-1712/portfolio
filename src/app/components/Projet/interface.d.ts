// Définition de l'interface Project
export type Project = {
  id: number | string;
  nom: string;
  type: string;
  image: string;
  description: string;
  language_prog: string;
  statut: string;
  repository: string;
  framework: string;
  module: string;
  url: string;
  date_debut: string;
  date_fin: string;
  pinned?: boolean;
  tags?: string[];
  version?: string | null;
}


export type ProjetVignetteProps = {
  projects: Project[];
};


export interface ProjectProps {
  statut: string;
}