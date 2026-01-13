interface KeywordsProps {
    keywords: string[];
}

export default function Keywords({ keywords }: KeywordsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 my-8">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2">
                Mots-clés
            </span>
            {keywords.map((keyword) => (
                <span
                    key={keyword}
                    className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm font-medium border border-zinc-200 dark:border-zinc-700 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                    {keyword}
                </span>
            ))}
        </div>
    );
}