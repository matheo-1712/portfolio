"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProjetBanner from "./project_list/projetBanner";
import type { Project as ProjectType } from "./interface";

interface ProjectProps {
    projects: ProjectType[];
}

export function Project({ projects }: ProjectProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>(projects);
    const [allTags, setAllTags] = useState<string[]>([]);

    // Read tag from URL
    const selectedTag = searchParams.get("tag");

    // Extract tags on init and sort them with priority
    useEffect(() => {
        const tagSet = new Set<string>();
        projects.forEach(p => {
            if (p.tags) p.tags.forEach(t => tagSet.add(t));
            if (p.type) tagSet.add(p.type);
            if (p.language_prog) tagSet.add(p.language_prog);
        });

        const priorityTags = ["En Production", "En phase de test", "Non Maintenu"];

        const sortedTags = Array.from(tagSet).sort((a, b) => {
            const indexA = priorityTags.indexOf(a);
            const indexB = priorityTags.indexOf(b);

            // If both are priority tags, sort by priority index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only A is priority, it comes first
            if (indexA !== -1) return -1;
            // If only B is priority, it comes first
            if (indexB !== -1) return 1;

            // Otherwise alphabetical sort
            return a.localeCompare(b);
        });

        setAllTags(sortedTags);
    }, [projects]);

    // Handle filtering based on selectedTag (from URL)
    useEffect(() => {
        if (!selectedTag) {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p =>
                p.tags?.includes(selectedTag) || p.type === selectedTag || p.language_prog === selectedTag
            ));
        }
    }, [selectedTag, projects]);

    const handleTagClick = (tag: string | null) => {
        if (tag) {
            if (tag === selectedTag) {
                // Deselect if already active
                router.push(pathname);
            } else {
                router.push(`${pathname}?tag=${encodeURIComponent(tag)}`);
            }
        } else {
            // Select "Tous"
            router.push(pathname);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full mb-12">

            {/* Filter Section */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleTagClick(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === null
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                        }`}
                >
                    Tous
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <ProjetBanner projects={filteredProjects} />
        </div>
    );
}
