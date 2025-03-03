import Image from "next/image";

export default function HardSkills() {
    return (
        <div id="Hard-Skills" className="w-full p-2 px-8">
            {/* Section Titre */}
            <div id="title" className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl mb-2">✨ Mes Hard Skills ✨</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Voici les compétences techniques et théoriques qui me permettent de réaliser mes projets avec succès.
                </p>
            </div>

            {/* Connaissances Techniques et Théoriques */}
            <div id="learning" className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mes connaissances techniques et théoriques :</h3>
                <div className="flex flex-wrap gap-6 justify-center pb-6">
                    {[
                        { src: "/img/logo/code.png", alt: "POO", name: "Programmation Orientée Objet", dark: true },
                        { src: "/img/logo/sql.png", alt: "SQL", name: "SQL" },
                        { src: "/svg/scrum.svg", alt: "SCRUM", name: "Méthodologie SCRUM" },
                        { src: "/img/logo/lamp.png", alt: "Logo LAMP", name: "Système LAMP" },
                        { src: "/img/logo/docker.png", alt: "DOCKER", name: "Docker" },
                        { src: "/img/logo/linux.png", alt: "LINUX", name: "Système Linux" },
                        { src: "/img/logo/virtualbox.png", alt: "VIRTUALBOX", name: "VirtualBox" },
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-28">
                            <div className="flex items-center justify-center w-24 h-24 mb-2">
                                <Image
                                    src={tech.src}
                                    alt={tech.alt}
                                    height={60}
                                    width={60}
                                    priority
                                    title={tech.name}
                                    className={`hover:scale-105 transition-transform duration-300 ease-in-out ${tech.dark ? "dark:invert" : ""}`}
                                />
                            </div>
                            <span className="text-center text-gray-800 dark:text-white font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Langages de Programmation */}
            <div id="programming-languages" className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mes langages de programmation :</h3>
                <div className="flex flex-wrap gap-6 justify-center pb-6">
                    {[
                        { src: "/svg/typescript.svg", alt: "Logo TypeScript", name: "TypeScript", dark: false },
                        { src: "/img/logo/javascript.png", alt: "Logo JavaScript", name: "JavaScript", dark: false },
                        { src: "/img/logo/php.png", alt: "Logo PHP", name: "PHP", dark: false },
                        { src: "/img/logo/python.png", alt: "Logo Python", name: "Python", dark: false },
                        { src: "/img/logo/kotlin.png", alt: "Logo Kotlin", name: "Kotlin", dark: false },
                        { src: "/img/logo/java.png", alt: "Logo Java", name: "Java", dark: false },
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-28">
                            <div className="flex items-center justify-center w-24 h-24 mb-2">
                                <Image
                                    src={tech.src}
                                    alt={tech.alt}
                                    height={50}
                                    width={50}
                                    priority
                                    title={tech.name}
                                    className={`hover:scale-105 transition-transform duration-300 ease-in-out ${tech.dark ? "dark:invert" : ""}`}
                                />
                            </div>
                            <span className="text-center text-gray-800 dark:text-white font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technologies & Frameworks */}
            <div id="technologies" className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mes technologies & Frameworks :</h3>
                <div className="flex flex-wrap gap-6 justify-center">
                    {[
                        { src: "/img/logo/react.png", alt: "Logo React", name: "React" },
                        { src: "/svg/next.svg", alt: "Logo NextJS", name: "NextJS" },
                        { src: "/img/logo/github.png", alt: "Logo Github", name: "Github", dark: true },
                        { src: "/img/logo/laravel.png", alt: "Logo Laravel", name: "Laravel" },
                        { src: "/img/logo/tailwind.png", alt: "Logo TailwindCSS", name: "Tailwind CSS" },
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-28">
                            <div className="flex items-center justify-center w-24 h-24 mb-2">
                                <Image
                                    src={tech.src}
                                    alt={tech.alt}
                                    height={50}
                                    width={50}
                                    priority
                                    title={tech.name}
                                    className={`hover:scale-105 transition-transform duration-300 ease-in-out ${tech.dark ? "dark:invert" : ""}`}
                                />
                            </div>
                            <span className="text-center text-gray-800 dark:text-white font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
