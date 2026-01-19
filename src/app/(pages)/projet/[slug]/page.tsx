import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import ProjectRecommendations from "@/app/components/Projet/ProjectRecommendations";

// Define safe type for the imported MDX module
import { Project } from "@/app/components/Projet/interface";
import { getLatestRelease } from "@/app/utils/github";

// Define safe type for the imported MDX module
interface MdxModule {
    default: React.ComponentType;
    frontmatter: Project;
    images?: { src: string; caption: string }[];
}

export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), "src/app/(pages)/projet/content");
    const files = fs.readdirSync(contentDir);

    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({
            slug: file.replace(/\.mdx$/, ""),
        }));
}

export const dynamicParams = false; // 404 if unknown slug

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        // Dynamic import of the MDX file
        // We use a relative path that Webpack can statically analyze to some extent
        const mdxModule = (await import(`../content/${slug}.mdx`)) as MdxModule;
        const { default: Content, frontmatter } = mdxModule;

        // Fetch latest version from GitHub if repository is present
        let version: string | null = null;
        let isPrerelease: boolean = false;

        if (frontmatter.repository) {
            const releaseInfo = await getLatestRelease(frontmatter.repository);
            if (releaseInfo) {
                version = releaseInfo.version;
                isPrerelease = releaseInfo.isPrerelease;

                // Update date_fin if we have a release date
                const releaseDate = new Date(releaseInfo.date);
                const day = String(releaseDate.getDate()).padStart(2, '0');
                const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
                const year = releaseDate.getFullYear();
                frontmatter.date_fin = `${day}/${month}/${year}`;
            }
        }

        return (
            <div className="items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 1. Project Summary Card */}
                {frontmatter && <ProjetSummary {...frontmatter} version={version} isPrerelease={isPrerelease} flags={frontmatter.flags} />}

                <div id="content" className="mt-12 animate-fade-in-up">

                    {/* 2. Keywords Pills */}
                    {frontmatter?.tags && <Keywords keywords={frontmatter.tags} />}

                    {/* 3. Main MDX Content (Description, Features, etc.) */}
                    {/* The MDX file now only contains Markdown content and specific visual components like ZoomImage */}
                    <div className="prose dark:prose-invert max-w-none">
                        <Content />
                    </div>

                    {/* 4. Recommendations */}
                    {frontmatter && (
                        <ProjectRecommendations
                            currentSlug={slug}
                            currentType={frontmatter.type}
                        />
                    )}

                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading project:", error);
        notFound();
    }
}
