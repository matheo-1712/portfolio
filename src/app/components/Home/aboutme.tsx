"use client";

import { useState } from "react";
import QuiSuisJe from "./components-aboutme/qui_suis_je";
import HardSkills from "./components-aboutme/hard_skills";
import SoftSkills from "./components-aboutme/soft_skills";
import MyProject from "./components-aboutme/my_project";
import MyExperience from "./components-aboutme/my_experience";
import MesDiplomes from "./components-aboutme/mes_diplomes";

interface AboutMeItem {
    title: string;
    description: React.ReactNode;
}

export default function AboutMe() {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const aboutMe: AboutMeItem[] = [
        {
            title: "Qui suis-je ? 📍",
            description: <QuiSuisJe />
        },
        {
            title: "Hard skills 🔥",
            description: <HardSkills />
        },
        {
            title: "Soft skills 💪",
            description: <SoftSkills />
        },
        {
            title: "Mes diplômes 🎓",
            description: <MesDiplomes />
        },
        {
            title: "Mes projets 🚧",
            description: <MyProject />
        },
        {
            title: "Mes expériences 📈",
            description: <MyExperience />
        },
    ];

    const toggleContent = (index: number) => {
        setActiveIndex(activeIndex === index ? index : index);
    };

    return (
        <div className="w-full mx-auto pb-16 max-w-7xl">
            {/* Titres alignés en ligne et occupant tout l'espace */}
            <div className="flex flex-wrap justify-center">
                {aboutMe.map((item, index) => (
                    <h2
                    key={index}
                    onClick={() => toggleContent(index)}
                    className={`flex-1 text-center cursor-pointer border p-4 transition 
                    ${activeIndex === index ? "border-gray-300 md:border-gray-600 bg-gray-100 dark:bg-gray-900 md:bg-transparent" : "border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900"} 
                    ${index === 0 ? "rounded-tl-lg" : ""} 
                    ${index === aboutMe.length - 1 ? "rounded-none md:rounded-tr-lg sm:rounded-tr-lg lg:rounded-tr-lg" : ""} 
                    ${index === 3 ? "rounded-tr-lg md:rounded-none sm:rounded-none lg:rounded-none" : ""}
                    `}
                     >
                        {item.title}
                    </h2>
                ))}

            </div>

            {/* Affichage du contenu en dessous */}
            {activeIndex !== null && (
                <div className="p-6 border rounded-b-lg shadow-md min-h-[400px] overflow-y-auto">
                    {aboutMe[activeIndex].description}
                </div>
            )}
        </div>
    );
}
