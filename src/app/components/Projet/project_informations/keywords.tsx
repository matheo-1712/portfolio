interface KeywordsProps {
    keywords: string[];
}

export default function Keywords({ keywords }: KeywordsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 my-8">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2">
                Mots-clés
            </span>
            {keywords.map((keyword) => {
                const isProd = keyword === "En Production";
                const isMaintenu = keyword === "Non Maintenu";
                const isTest = keyword === "En test";

                let activeClasses = "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700";

                if (isProd) {
                    activeClasses = "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
                } else if (isMaintenu) {
                    activeClasses = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
                } else if (isTest) {
                    activeClasses = "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
                }

                return (
                    <span
                        key={keyword}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 transition-transform hover:scale-105 ${activeClasses}`}
                    >
                        {isProd && <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>}
                        {isMaintenu && <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>}
                        {isTest && <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>}
                        {keyword}
                    </span>
                );
            })}
        </div>
    );
}
