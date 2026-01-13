"use client";

import { useEffect, useState } from "react";
import ProjetBanner from "./project_list/projetBanner";
import type { Project as ProjectType } from "./interface";

interface ProjectProps {
    projects: ProjectType[];
}

export function Project({ projects }: ProjectProps) {

    const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>(projects);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract tags on init
    useEffect(() => {
        const tagSet = new Set<string>();
        projects.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
        setAllTags(Array.from(tagSet).sort());
        setFilteredProjects(projects);
    }, [projects]);

    // Handle filtering
    useEffect(() => {
        if (!selectedTag) {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.tags?.includes(selectedTag)));
        }
    }, [selectedTag, projects]);

    return (
        <div className="flex flex-col gap-8 w-full mb-12">

            {/* Filter Section */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedTag(null)}
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
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
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
