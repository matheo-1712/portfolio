"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import projectsData from "../../../../public/projets.json";

interface Project {
    id: number;
    nom: string;
    type: string;
    logo: string;
    description: string;
    date_debut: string; // Format: DD-MM-YYYY
    url: string;
    tags?: string[];
}

interface ProjectRecommendationsProps {
    currentSlug: string;
    currentType: string;
}

// Helper to parse date "DD/MM/YYYY" to Date object
const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

export default function ProjectRecommendations({ currentSlug, currentType }: ProjectRecommendationsProps) {
    const [randomProject, setRandomProject] = useState<Project | null>(null);
    const [mounted, setMounted] = useState(false);

    // Static analysis (same for server and client)
    const allProjects = projectsData as Project[];
    const otherProjects = allProjects.filter(p => !p.url.endsWith(`/${currentSlug}`));

    // 1. Same Theme
    const sameThemeProjects = otherProjects.filter(p => p.type === currentType);
    const relatedProject = sameThemeProjects.sort((a, b) => parseDate(b.date_debut).getTime() - parseDate(a.date_debut).getTime())[0];

    // 2. Most Recent
    const recentProjects = otherProjects
        .filter(p => p.id !== relatedProject?.id)
        .sort((a, b) => parseDate(b.date_debut).getTime() - parseDate(a.date_debut).getTime());
    const recentProject = recentProjects[0];

    // 3. Random (Client-side only to avoid hydration mismatch)
    useEffect(() => {
        setMounted(true);
        const remainingProjects = otherProjects.filter(p =>
            p.id !== relatedProject?.id &&
            p.id !== recentProject?.id
        );

        if (remainingProjects.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingProjects.length);
            setRandomProject(remainingProjects[randomIndex]);
        }
    }, [currentSlug, relatedProject?.id, recentProject?.id]); // Re-run if dependencies change, though usually static on page load

    if (!relatedProject && !recentProject && !randomProject) return null;

    return (
        <div className="w-full mt-24 border-t border-gray-200 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white/90">
                Voir aussi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Related Project Card */}
                {relatedProject && (
                    <RecommendationCard
                        project={relatedProject}
                        label="Dans la même catégorie"
                        colorClass="text-teal-600 dark:text-teal-300 bg-teal-100/80 dark:bg-black/60 border-teal-200 dark:border-teal-500/30"
                    />
                )}

                {/* Recent Project Card */}
                {recentProject && (
                    <RecommendationCard
                        project={recentProject}
                        label="Le plus récent"
                        colorClass="text-purple-600 dark:text-purple-300 bg-purple-100/80 dark:bg-black/60 border-purple-200 dark:border-purple-500/30"
                    />
                )}

                {/* Random Project Card - Only show when mounted to avoid layout shift or hydration error, or render placeholder? 
                     Better to just render if state is set. */}
                {randomProject && mounted && (
                    <RecommendationCard
                        project={randomProject}
                        label="À découvrir"
                        colorClass="text-orange-600 dark:text-orange-300 bg-orange-100/80 dark:bg-black/60 border-orange-200 dark:border-orange-500/30"
                    />
                )}
            </div>
        </div>
    );
}

function RecommendationCard({ project, label, colorClass }: { project: Project; label: string, colorClass: string }) {
    return (
        <Link href={project.url} className="group relative block h-full">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/0 via-purple-500/0 to-orange-500/0 group-hover:from-teal-500/10 group-hover:via-purple-500/10 group-hover:to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>

            <div className="relative h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 shadow-sm hover:shadow-md">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-neutral-800/50">
                    <Image
                        src={project.logo}
                        alt={project.nom}
                        fill
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Floating Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border backdrop-blur-md ${colorClass}`}>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {label}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                            {project.nom}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-neutral-400 border border-gray-200 dark:border-white/10 px-2 py-1 rounded bg-gray-100 dark:bg-white/5 font-medium">
                            {project.type}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
