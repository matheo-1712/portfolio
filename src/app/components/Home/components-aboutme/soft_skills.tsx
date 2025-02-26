export default function SoftSkills() {
    return (
        <div id="soft-skills" className="p-2 rounded-2xl dark:shadow-lg mx-auto w-full">
            {/* Section de titre */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl mb-2">✨ Mes Soft Skills ✨</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Voici les compétences humaines qui me permettent de m&apos;épanouir et d&apos;atteindre mes objectifs tout en collaborant efficacement avec les autres.
                </p>
            </div>

            {/* Liste des Soft Skills */}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[
                    { icon: "🤝", text: "Mon esprit d’équipe" },
                    { icon: "🔍", text: "Ma curiosité" },
                    { icon: "⚖️", text: "Mon intégrité" },
                    { icon: "🛠️", text: "Ma résolution de problèmes" },
                    { icon: "💡", text: "Ma pensée critique" },
                    { icon: "❤️", text: "Mon empathie" },
                    { icon: "🌊", text: "Mon calme" },
                    { icon: "☀️", text: "Ma bonne humeur" },
                ].map((skill, index) => (
                    <li
                        key={index}
                        className="p-4 flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <span className="text-xl">{skill.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{skill.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
