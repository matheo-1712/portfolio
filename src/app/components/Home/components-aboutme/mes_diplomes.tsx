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
        <div id="mes-diplomes" className="w-full p-2 ">
            {/* Titre */}
            <div className="text-center mb-8 p-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Voici les diplômes que j&apos;ai obtenus jusqu&apos;à présent.
                </p>
            </div>

            {/* Liste des diplômes */}
            <div className="grid gap-6 md:grid-cols-2">
                {diplomes.map((diplome) => (
                    <div
                        key={diplome.id}
                        className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {diplome.titre}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {diplome.ecole} - {diplome.annee}
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 mt-2">
                            {diplome.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
