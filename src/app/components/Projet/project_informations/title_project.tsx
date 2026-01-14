interface TitleProjectProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export default function Title_Project({ title, subtitle, children }: TitleProjectProps) {
    const text = title || children;
    return (
        <div className="mb-8 mt-12">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {text}
                </h2>
            </div>
            {subtitle && (
                <div className="pl-4 mt-2 border-l-2 border-gray-200 dark:border-gray-800 ml-1">
                    <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold pl-4">
                        {subtitle}
                    </p>
                </div>
            )}
        </div>
    );
}
