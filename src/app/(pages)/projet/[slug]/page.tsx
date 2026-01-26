import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";
import ProjectRecommendations from "@/app/components/Projet/ProjectRecommendations";

// Define safe type for the imported MDX module
import { Project } from "@/app/components/Projet/interface";


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

        return (
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 1. Project Summary Card */}
                {frontmatter && <ProjetSummary {...frontmatter} version={frontmatter.version} isPrerelease={frontmatter.isPrerelease} flags={frontmatter.flags} />}

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Column - Centered and Wider */}
                    <div className="lg:col-span-12 space-y-8 animate-fade-in-up">

                        {/* Article Content */}
                        <div className="glass-panel rounded-[2.5rem] p-8 md:p-12">
                            {/* Keywords */}
                            {frontmatter?.tags && (
                                <div className="mb-10 pb-8 border-b border-gray-100 dark:border-zinc-800">
                                    <Keywords keywords={frontmatter.tags} />
                                </div>
                            )}

                            {/* Markdown Content */}
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <Content />
                            </div>
                        </div>

                        {/* Navigation / Recommendations */}
                        {frontmatter && (
                            <ProjectRecommendations
                                currentSlug={slug}
                                currentType={frontmatter.type}
                            />
                        )}
                    </div>

                    {/* Sidebar Column (Optional for future table of contents or extra info, sticking with simple layout for now but prepared grid) 
                         For now, making the content full width or ensuring centered focus. 
                         Actually, let's keep it simple and centered as per original but better styled.
                         Reverting to single column for better readability of large code blocks, 
                         but keeping the glass panel.
                     */}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading project:", error);
        notFound();
    }
}
