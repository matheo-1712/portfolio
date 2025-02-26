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
        <div className="max-w-6xl mx-auto p-2 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl mb-2">📈 Mes expériences 📈</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                Voici mes expériences professionnelles, qui sont pour l&apos;instant uniquement des stages d&apos;un mois.
            </p>
            <div className="relative mt-6 border-l-4 border-black dark:border-gray-100 pl-10 w-full rounded-2xl">
                {experiences.map((exp, index) => (
                    <div key={index} className="mb-10 flex flex-col items-start">
                        <div className="absolute -left-2 w-5 h-5 bg-black dark:bg-gray-100 rounded-full"></div>
                        <p className="text-xl font-semibold">{exp.year} - {exp.title} ({exp.company})</p>
                        <p className="text-lg text-gray-600 max-w-3xl whitespace-pre-line">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
