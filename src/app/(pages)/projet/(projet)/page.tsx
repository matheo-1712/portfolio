import { Project } from "@/app/components/Projet/project";

export default function Projet() {
    return (
        <div id="projet">
            <h1 className="text-4xl font-bold">Liste de mes projets</h1>
            <p className="text-xl mt-4">
                Voici une liste de mes projets en cours, finit, et à venir.
            </p>
            
            <br />

            <Project statut="1" />
            <Project statut="0" />
            <Project statut="2" />
        </div>
    );
}