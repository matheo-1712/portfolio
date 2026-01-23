"use client";

import Image from "next/image";

export default function HardSkills() {
    const allSkills = [
        // Langages
        { src: "/svg/typescript.svg", alt: "TypeScript", name: "TypeScript", dark: false },
        { src: "/img/logo/javascript.png", alt: "JavaScript", name: "JavaScript", dark: false },
        { src: "/img/logo/php.png", alt: "PHP", name: "PHP", dark: false },
        { src: "/img/logo/python.png", alt: "Python", name: "Python", dark: false },
        { src: "/img/logo/java.png", alt: "Java", name: "Java", dark: false },
        { src: "/img/logo/kotlin.png", alt: "Kotlin", name: "Kotlin", dark: false },
        { src: "/img/logo/sql.png", alt: "SQL", name: "SQL" },

        // Frameworks & Libraries
        { src: "/img/logo/react.png", alt: "React", name: "React" },
        { src: "/img/logo/laravel.png", alt: "Laravel", name: "Laravel" },
        { src: "/img/logo/tailwind.png", alt: "Tailwind", name: "Tailwind" },

        // Outils & Systèmes
        { src: "/img/logo/docker.png", alt: "DOCKER", name: "Docker" },
        { src: "/img/logo/linux.png", alt: "LINUX", name: "Linux" },
        { src: "/img/logo/github.png", alt: "Github", name: "Github", dark: true },
    ];

    // Duplicating the array to create the seamless loop effect
    const duplicatedSkills = [...allSkills, ...allSkills];

    return (
        <div className="w-full h-full flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex flex-row gap-8 items-center animate-scroll hover:[animation-play-state:paused] w-max">
                {duplicatedSkills.map((tech, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[80px] group/icon">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 mb-2 transition-transform duration-300 group-hover/icon:scale-110">
                            <Image
                                src={tech.src}
                                alt={tech.alt}
                                fill
                                className={`object-contain ${tech.dark ? "dark:invert" : ""}`}
                                sizes="(max-width: 768px) 56px, 64px"
                            />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
