import Image from "next/image";

export default function HardSkills() {
    return (
        <div id="Hard Skills" className="w-full px-4">
            <div id="learning">
                <h2>Mes connaissances techniques et théoriques :</h2>
                <br />
                <div className="flex flex-wrap gap-4 justify-center pb-6">
                    {[
                        { src: "/img/logo/code.png", alt: "POO", name: "Programation Orientée Objet", dark: true },
                        { src: "/img/logo/sql.png", alt: "SQL", name: "SQL" },
                        { src: "/svg/scrum.svg", alt: "SCRUM", name: "Méthodologie SCRUM" },
                        { src: "/img/logo/lamp.png", alt: "Logo LAMP", name: "Système LAMP" },
                        { src: "/img/logo/docker.png", alt: "DOCKER", name: "Docker" },
                        { src: "/img/logo/linux.png", alt: "LINUX", name: "Système Linux"},
                        { src: "/img/logo/virtualbox.png", alt: "VIRTUALBOX", name: "VirtualBox"},
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-24">
                            <div className="flex items-center justify-center w-24 h-20">
                                <Image src={tech.src} alt={tech.alt} height={60} width={60} priority title={tech.name} className={tech.dark ? "dark:invert" : ""} />
                            </div>
                            <span className="text-center">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div id="programming-languages">
                <h2>Mes langages de programmation :</h2>
                <br />
                <div className="flex flex-wrap gap-4 justify-center">
                    {[
                        { src: "/svg/typescript.svg", alt: "Logo TypeScript", name: "TypeScript" },
                        { src: "/img/logo/javascript.png", alt: "Logo JavaScript", name: "JavaScript" },
                        { src: "/img/logo/php.png", alt: "Logo PHP", name: "PHP" },
                        { src: "/img/logo/python.png", alt: "Logo Python", name: "Python" },
                        { src: "/img/logo/kotlin.png", alt: "Logo Kotlin", name: "Kotlin" },
                        { src: "/img/logo/java.png", alt: "Logo Java", name: "Java" },
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-24">
                            <div className="flex items-center justify-center w-24 h-20">
                                <Image src={tech.src} alt={tech.alt} height={40} width={40} priority title={tech.name} />
                            </div>
                            <span className="text-center">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <div id="technologies">
                <h2>Mes technologies & Frameworks :</h2>
                <br />
                <div className="flex flex-wrap gap-4 justify-center">
                    {[
                        { src: "/img/logo/react.png", alt: "Logo React", name: "React" },
                        { src: "/svg/next.svg", alt: "Logo NextJS", name: "NextJS" },
                        { src: "/img/logo/github.png", alt: "Logo Github", name: "Github", dark: true },
                        { src: "/img/logo/laravel.png", alt: "Logo Laravel", name: "Laravel" },
                        { src: "/img/logo/tailwind.png", alt: "Logo TailwindCSS", name: "Tailwind CSS" },
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center w-24">
                            <div className="flex items-center justify-center w-24 h-20">
                                <Image src={tech.src} alt={tech.alt} height={40} width={40} priority title={tech.name}  className={tech.dark ? "dark:invert" : ""} />
                            </div>
                            <span className="text-center">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
