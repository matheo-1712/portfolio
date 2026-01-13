interface TitleProjectProps {
    title?: string;
    children?: React.ReactNode;
}

export default function Title_Project({ title, children }: TitleProjectProps) {
    const text = title || children;
    return (
        <div className="flex items-center gap-3 mb-8 mt-12">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                {text}
            </h2>
        </div>
    );
}
