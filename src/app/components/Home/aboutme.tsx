"use client";

import { useState } from "react";

interface AboutMeItem {
    title: string;
    description: string;
}

export default function AboutMe() {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const aboutMe: AboutMeItem[] = [
        {
            title: "Qui suis-je ? 📍",
            description: "Contenu du premier élément. Lorem ipsum dolor sit amet..."
        },
        {
            title: "Hard skills 🔥",
            description: "Contenu du deuxième élément. Lorem ipsum dolor sit amet..."
        },
        {
            title: "Soft skills 💪",
            description: "Contenu du troisième élément. Lorem ipsum dolor sit amet..."
        },
        {
            title: "Mes projets 💻",
            description: "Contenu du cinquième élément. Lorem ipsum dolor sit amet..."
        },
        {
            title: "Mes expériences 📈",
            description: "Contenu du sixième élément. Lorem ipsum dolor sit amet..."
        },
        {
            title: "Mes passions ✨",
            description: "Contenu du quatrième élément. Lorem ipsum dolor sit amet..."
        },
    ];

    const toggleContent = (index: number) => {
        setActiveIndex(activeIndex === index ? index : index);
    };

    return (
        <div className="w-full mx-auto">
            {/* Titres alignés en ligne et occupant tout l'espace */}
            <div className="flex">
                {aboutMe.map((item, index) => (
                    <h2
                        key={index}
                        onClick={() => toggleContent(index)}
                        className={`flex-1 text-center cursor-pointer border p-4 transition
                        ${activeIndex === index ? "border-gray-500" : "border-gray-300 hover:bg-gray-900 z-10"} 
                        ${index === 0 ? "rounded-tl-lg" : ""} 
                        ${index === aboutMe.length - 1 ? "rounded-tr-lg" : ""}
                        `}
                    >
                        {item.title}
                    </h2>
                ))}

            </div>

            {/* Affichage du contenu en dessous */}
            {activeIndex !== null && (
                <div className="p-6 border rounded-b-lg shadow-md min-h-[300px] max-h-300px">
                    <p>{aboutMe[activeIndex].description}</p>
                </div>
            )}
        </div>
    );
}
