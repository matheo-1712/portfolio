export default function MesDiplomes() {
    const diplomes = [
        {
            id: 1,
            titre: "🎓 Baccalauréat professionnel Gestion-Administration",
            ecole: "Lycée Jean-Hyppolite",
            annee: 2022,
            description: "Un diplôme qui m'a permis d'acquérir des compétences en gestion administrative et en comptabilité."
        },
        {
            id: 2,
            titre: "🎓 BTS Services Informatiques aux Organisations (Option SLAM)",
            ecole: "Lycée Polyvalent Régional Merleau-Ponty",
            annee: 2024,
            description: "Un diplôme qui m'a permis d'acquérir des compétences en développement informatique et en gestion de projets."
        }
    ];

    return (
        <div className="relative border-l-2 border-gray-200 dark:border-zinc-700 ml-3 md:ml-6 space-y-12">
            {diplomes.map((diplome, index) => (
                <div key={diplome.id} className="relative pl-8 md:pl-12">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900 shadow-md transform transition-transform hover:scale-125 duration-300"></div>

                    {/* Content Card */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {diplome.titre.replace("🎓 ", "")}
                        </h3>
                        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                            {diplome.annee}
                        </span>
                    </div>

                    <p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {diplome.ecole}
                    </p>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700/50 text-gray-600 dark:text-gray-400 text-sm leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                        {diplome.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
