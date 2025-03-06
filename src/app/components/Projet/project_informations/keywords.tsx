interface KeywordsProps {
    keywords: string[];
}

export default function Keywords({ keywords }: KeywordsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <p className="p-2">Mots-clés :</p>
            {keywords.map((keyword) => (
                <span key={keyword} className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-2 rounded-full text-sm">
                    {keyword}
                </span>
            ))}
        </div>
    );
}