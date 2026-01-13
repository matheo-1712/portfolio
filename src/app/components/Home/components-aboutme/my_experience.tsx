export default function MyExperience() {
    const experiences = [
        {
            year: "02/2024",
            title: "Développeur Full Stack",
            company: "UFOLEP 17",
            description: "Participation à l'amélioration d'une application web :\n- Mise à jour et ajout de fonctionnalités\n- Optimisation et correction de bugs\n- Travail collaboratif en mode projet via un tableau de bord\n- Adaptation et compréhension d'un framework spécifique"
        },
        {
            year: "06/2023",
            title: "Développeur WordPress",
            company: "NTConseil",
            description: "Travail sur des applications WordPress :\n - Création de thème\n - Formation sur Elementor\n Formation framework PHP : \n - Zend Framework."
        },
    ];

    return (
        <div className="relative border-l-2 border-gray-200 dark:border-zinc-700 ml-3 md:ml-6 space-y-12">
            {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8 md:pl-12">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-900 shadow-md transform transition-transform hover:scale-125 duration-300"></div>

                    {/* Content Card */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {exp.title}
                        </h3>
                        <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                            {exp.year}
                        </span>
                    </div>

                    <p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        {exp.company}
                    </p>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700/50 text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line shadow-sm hover:shadow-md transition-shadow">
                        {exp.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
