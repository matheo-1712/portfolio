import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";
import Keywords from "@/app/components/Projet/project_informations/keywords";

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
            <div className="items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 1. Project Summary Card */}
                {frontmatter && <ProjetSummary {...frontmatter} />}

                <div id="content" className="mt-12 animate-fade-in-up">

                    {/* 2. Keywords Pills */}
                    {frontmatter?.tags && <Keywords keywords={frontmatter.tags} />}

                    {/* 3. Main MDX Content (Description, Features, etc.) */}
                    {/* The MDX file now only contains Markdown content and specific visual components like ZoomImage */}
                    <div className="prose dark:prose-invert max-w-none">
                        <Content />
                    </div>

                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading project:", error);
        notFound();
    }
}
