"use client";

import Image from "next/image";
import Link from "next/link";
import HardSkills from "./components-aboutme/hard_skills";

export default function AboutMe() {
    return (
        <div className="w-full mx-auto h-auto md:h-screen min-h-[600px] max-w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-6 gap-3 h-full">

                {/* 1. Introduction (Top Left) - Expanded to take Soft Skills space */}
                <div className="md:col-span-3 md:row-span-3 group relative p-8 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-[2rem]" />
                    <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-4 tracking-tight">
                        Bonjour, je suis Pérodeau Mathéo 👋
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mb-6">
                        Développeur passionné, créateur de solutions numériques et explorateur de technologies.
                        Basé en France 🇫🇷.
                    </p>

                    {/* Integrated Soft Skills */}
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium text-sm">Gestion de projet</span>
                        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium text-sm">Travail d&apos;équipe</span>
                        <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-medium text-sm">Autonomie</span>
                        <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-medium text-sm">Curiosité</span>
                        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-sm">Adaptabilité</span>
                    </div>
                </div>

                {/* 2. Profile Image (Top Right) - Shrunk to 1 col x 3 rows */}
                <div className="md:col-span-1 md:row-span-3 group relative bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex items-center justify-center">
                    <Image
                        className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105"
                        src="/me.png"
                        width={500}
                        height={500}
                        alt="Pérodeau Mathéo"
                        priority
                    />
                </div>

                {/* 3. Hard Skills (Middle Full Width) - Expanded to take prominent space */}
                <div className="md:col-span-4 md:row-span-1 group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-lg rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center px-2">
                    <HardSkills />
                </div>

                {/* 4. Projets Tile (Bottom Left) - 2 cols x 2 rows */}
                <div className="md:col-span-2 md:row-span-2">
                    <Link href="/projet" className="h-full w-full group relative p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>
                        </div>
                        <h3 className="text-white text-3xl font-bold z-10">Projets 🚧</h3>
                        <div className="flex justify-between items-end z-10">
                            <span className="text-white/90 text-lg font-medium">Voir mes réalisations</span>
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 5. Parcours Tile (Bottom Right) - 2 cols x 2 rows */}
                <div className="md:col-span-2 md:row-span-2">
                    <Link href="/parcours" className="h-full w-full group relative p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                        </div>
                        <h3 className="text-white text-3xl font-bold z-10">Parcours 🚀</h3>
                        <div className="flex justify-between items-end z-10">
                            <span className="text-white/90 text-lg font-medium">Expériences & Diplômes</span>
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
