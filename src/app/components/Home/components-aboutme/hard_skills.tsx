import Image from "next/image";

export default function HardSkills() {
    return (
        <div className="w-full px-4">
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
                <h2>Mes technologies :</h2>
                <br />
                <div className="flex flex-wrap gap-4 justify-center">
                    {[
                        { src: "/img/logo/react.png", alt: "Logo React", name: "React" },
                        { src: "/svg/next.svg", alt: "Logo NextJS", name: "NextJS" },
                        { src: "/img/logo/github.png", alt: "Logo Github", name: "Github" },
                        { src: "/img/logo/laravel.png", alt: "Logo Laravel", name: "Laravel" },
                        { src: "/img/logo/tailwind.png", alt: "Logo TailwindCSS", name: "Tailwind CSS" },
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
        </div>
    );
}
