import { Project } from "@/app/components/Projet/project";
import { getAllProjects } from "@/app/components/Projet/projectContent";

export default async function Projet() {
    const projects = await getAllProjects();

    // Sorting logic here (Server Side) to ensure passed to client is sorted
    const sortedProjects = projects.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        const parseDate = (dateStr: string) => {
            const parts = dateStr.split("-");
            if (parts.length !== 3) return 0; // fallback
            // Note: dateStr is DD-MM-YYYY
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        };

        // If date is "XX-XX-XXXX", treat as very old or handle?
        if (a.date_debut.includes("XX")) return 1;
        if (b.date_debut.includes("XX")) return -1;

        return parseDate(b.date_debut) - parseDate(a.date_debut);
    });

    return (
        <div id="projet" className="w-full mx-auto h-auto min-h-[600px] max-w-full px-4 sm:px-6 lg:px-8 py-4">

            {/* Header / Hero Section */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-block p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-4 tracking-tight">
                    Mes Projets
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    Une compilation de mes travaux personnels et professionnels.
                    <br />
                    Découvrez ce que j&apos;ai construit, du concept au déploiement. 🛠️
                </p>
            </div>

            <Project projects={sortedProjects} />
        </div>
    );
}