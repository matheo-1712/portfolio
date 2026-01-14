import TitleProject from "./title_project";

interface ListProjectProps {
    title?: string;
    items: string[];
}

export default function ListProject({ title, items }: ListProjectProps) {
    return (
        <div className="my-8">
            {title && <TitleProject title={title} />}
            <ul className="space-y-3 mt-4">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                        <span dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }}></span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Simple helper to bold text wrapped in **
function parseMarkdown(text: string) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
