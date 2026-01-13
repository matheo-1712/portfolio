"use client";

import MyExperience from "@/app/components/Home/components-aboutme/my_experience";
import MesDiplomes from "@/app/components/Home/components-aboutme/mes_diplomes";

export default function Parcours() {
    return (
        <div className="w-full mx-auto h-auto min-h-[600px] max-w-full px-4 sm:px-6 lg:px-8 py-4 space-y-12">

            {/* Header */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
                    Mon Parcours
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    Découvrez mon évolution académique et professionnelle, des formations qui m&apos;ont forgé aux expériences qui m&apos;ont fait grandir.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expériences */}
                <section className="col-span-1 h-full">
                    <div className="h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">📈</span>
                            Expériences
                        </h2>
                        <MyExperience />
                    </div>
                </section>

                {/* Diplômes */}
                <section className="col-span-1 h-full">
                    <div className="h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">🎓</span>
                            Diplômes & Formations
                        </h2>
                        <MesDiplomes />
                    </div>
                </section>
            </div>

        </div>
    );
}
