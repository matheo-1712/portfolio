"use client";

import { useEffect, useState } from "react";
import { projectFetch } from "./projectFetch";
import ProjetBanner from "./components/projetBanner";
import { ProjectProps } from "./interface";

export function Project({ statut }: ProjectProps) {

      const [projects, setProjects] = useState<Project[]>([]);
      
      useEffect(() => {
          const fetchProjects = async () => {
              try {
                  const data = await projectFetch(statut);
                  setProjects(data || []);
              } catch (error) {
                  console.error("Erreur lors du chargement des projets :", error);
              }
          };
  
          fetchProjects();
      }, []);

      const statusLabels: { [key: string]: string } = {
        "0": "terminé",
        "1": "en cours",
        "2": "futur",
      };
  
      return (
          <div className="flex flex-col gap-8 row-start-2 mb-16 items-center sm:items-start">
              <h1 className="text-4xl font-bold">Projets {statusLabels[statut] || "Inconnu"}</h1>
              <ProjetBanner projects={projects} />
          </div>
      );
}
