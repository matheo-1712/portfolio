"use client";

import MyExperience from "@/app/components/Home/components-aboutme/my_experience";
import MesDiplomes from "@/app/components/Home/components-aboutme/mes_diplomes";

export default function Parcours() {
    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-12">

            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Mon Parcours 🚀
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Découvrez mon évolution académique et professionnelle, des formations qui m&apos;ont forgé aux expériences qui m&apos;ont fait grandir.
                </p>
            </div>

            {/* Expériences */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-l-4 border-emerald-500 pl-4 text-emerald-700 dark:text-emerald-400">
                    Expériences Professionnelles 📈
                </h2>
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                    <MyExperience />
                </div>
            </section>

            {/* Diplômes */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-l-4 border-blue-500 pl-4 text-blue-700 dark:text-blue-400">
                    Diplômes & Formations 🎓
                </h2>
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                    <MesDiplomes />
                </div>
            </section>

        </div>
    );
}
