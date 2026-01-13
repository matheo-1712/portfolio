import type { MDXComponents } from 'mdx/types'
import Title_Project from "@/app/components/Projet/project_informations/title_project";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h2: ({ children }) => <Title_Project>{children}</Title_Project>,
        p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700 dark:text-gray-300">{children}</ul>,
        li: ({ children }) => <li className="pl-2">{children}</li>,
        a: ({ href, children }) => <a href={href} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors">{children}</a>,
        ...components,
    }
}
