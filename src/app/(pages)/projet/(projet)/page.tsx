import { Project } from "@/app/components/Projet/project";

export default function Projet() {
    return (
        <div id="projet" className="w-full mx-auto h-auto min-h-[600px] max-w-full px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-4 tracking-tight">
                Liste de mes projets
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mb-12">
                Voici une liste de mes projets en cours, terminés, et à venir.
            </p>

            <Project />
        </div>
    );
}