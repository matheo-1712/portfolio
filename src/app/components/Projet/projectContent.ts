import fs from "fs";
import path from "path";
import { Project } from "./interface";

const contentDir = path.join(process.cwd(), "src/app/(pages)/projet/content");

import { getLatestRelease } from "@/app/utils/github";

export async function getAllProjects(): Promise<Project[]> {
    if (!fs.existsSync(contentDir)) return [];

    const files = fs.readdirSync(contentDir);
    const projects: Project[] = [];

    for (const file of files) {
        if (!file.endsWith(".mdx")) continue;

        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const slug = file.replace(/\.mdx$/, "");

        // Simple Frontmatter parsing
        const match = /---\n([\s\S]+?)\n---/.exec(fileContent);
        if (match) {
            const frontmatterBlock = match[1];
            const frontmatter: Record<string, string | boolean | string[]> = {};

            frontmatterBlock.split("\n").forEach(line => {
                const [key, ...valueParts] = line.split(":");
                if (key && valueParts.length > 0) {
                    let value = valueParts.join(":").trim();
                    // Remove quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    }
                    // Handle array
                    if (value.startsWith("[") && value.endsWith("]")) {
                        frontmatter[key.trim()] = value.slice(1, -1).split(",").map(s => s.trim().replace(/^"|"$/g, ''));
                    } else if (value === "true") {
                        frontmatter[key.trim()] = true;
                    } else if (value === "false") {
                        frontmatter[key.trim()] = false;
                    } else {
                        frontmatter[key.trim()] = value;
                    }
                }
            });

            projects.push({
                id: slug, // Use slug as ID
                ...frontmatter,
                url: `/projet/${slug}`, // Dynamic URL
                tags: frontmatter.tags || []
            } as Project);
        }
    }

    // Fetch versions in parallel
    const projectsWithVersions = await Promise.all(projects.map(async (project) => {
        if (project.repository) {
            const releaseInfo = await getLatestRelease(project.repository);
            if (releaseInfo) {
                // If we have a release date, format it as DD-MM-YYYY to match existing format
                const releaseDate = new Date(releaseInfo.date);
                const day = String(releaseDate.getDate()).padStart(2, '0');
                const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
                const year = releaseDate.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                return {
                    ...project,
                    version: releaseInfo.version,
                    date_fin: formattedDate // Overwrite date_fin with release date
                };
            }
        }
        return project;
    }));

    // Sort by pinned then date? Or just custom.
    // Let's preserve the "Pinned" logic if exists.
    return projectsWithVersions;
}
