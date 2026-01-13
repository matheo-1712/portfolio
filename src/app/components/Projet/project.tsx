"use client";

import { useEffect, useState } from "react";
import { fetchAllProjects } from "./projectFetch";
import ProjetBanner from "./project_list/projetBanner";
import type { Project } from "./interface";

export function Project() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await fetchAllProjects();

                // Harmonize tags
                const processedData = data.map(p => {
                    const rawTags = [
                        p.language_prog,
                        p.framework,
                        p.module
                    ].filter(Boolean).join(","); // Join all non-empty fields

                    // Split by commonly used separators and cleanup
                    const tags = rawTags.split(/[\/,]/)
                        .map(t => t.trim())
                        .filter(t => t.length > 0)
                        // Normalize capitalization (simple approach: Title Case for known ones, or just trim)
                        .map(t => {
                            if (t.toLowerCase() === 'typescript') return 'TypeScript';
                            if (t.toLowerCase() === 'javascript') return 'JavaScript';
                            return t;
                        });

                    // Remove duplicates per project
                    return { ...p, tags: Array.from(new Set(tags)) };
                });

                // Sorting logic: Pinned first, then by date (newest first)
                const sortedData = processedData.sort((a, b) => {
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;

                    const parseDate = (dateStr: string) => {
                        const parts = dateStr.split("-");
                        if (parts.length !== 3) return 0; // fallback
                        // Note: dateStr is DD-MM-YYYY
                        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
                    };

                    return parseDate(b.date_debut) - parseDate(a.date_debut);
                });

                setProjects(sortedData);
                setFilteredProjects(sortedData);

                // Extract all unique tags
                const tagSet = new Set<string>();
                sortedData.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
                setAllTags(Array.from(tagSet).sort());

            } catch (error) {
                console.error("Erreur lors du chargement des projets :", error);
            }
        };

        fetchProjects();
    }, []);

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
