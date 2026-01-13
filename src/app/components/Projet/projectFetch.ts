import { Project } from "./interface";

export async function projectFetch(statut: string) {
    try {
        const response = await fetch("/projets.json");
        if (!response.ok) throw new Error("Erreur lors du chargement des projets.");

        const data: Project[] = await response.json();
        const projects = data.filter((project) => project.statut === statut);

        return projects;
    } catch (error) {
        console.error(error);
    }
}

export async function fetchAllProjects() {
    try {
        const response = await fetch("/projets.json");
        if (!response.ok) throw new Error("Erreur lors du chargement des projets.");

        const data: Project[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function projectFetchById(id: number) {
    try {
        const response = await fetch(`/projets.json`);
        if (!response.ok) throw new Error("Erreur lors du chargement des projets.");

        const data: Project[] = await response.json();
        const project = data.find((project) => project.id === id);

        return project;
    } catch (error) {
        console.error(error);
    }
}