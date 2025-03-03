import Image from "next/image";
import Link from "next/link";

export default function MyProject() {
    return (
        <div id="my-project" className="w-full p-2">
            <div id="title" className="text-center p2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl mb-2">🚧 Mes projets 🚧</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                    La plupart des projets que j&apos;ai réalisés sont disponibles juste en dessous,
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div id="my-project-title">
                    <p className="text-lg text-justify">
                        Mais ils sont aussi accessibles sur mon GitHub :
                        <Link href="https://github.com/matheo-1712" className="text-blue-600 font-semibold hover:underline"> matheo-1712</Link>.
                    </p>
                    <p className="mt-2 text-justify">
                        L&apos;un de mes projets ne concerne pas uniquement le développement, mais aussi la création d&apos;une communauté d&apos;utilisateurs.
                        Celle-ci me permet de concevoir des services et de développer des projets adaptés aux besoins réels de nos membres :
                    </p>
                </div>
            </div>

            <div id="antre-des-loutres" className="mt-2 p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <Link href="https://github.com/L-Antre-des-Loutres">
                        <Image
                            src="/img/logo/antredesloutres.png"
                            alt="Logo Antre des Loutres"
                            width={60}
                            height={60}
                            className="rounded-full hover:scale-105 transition-transform duration-300 ease-in-out"
                        /></Link>
                    <Link href="https://github.com/L-Antre-des-Loutres" className="font-semibold hover:underline">
                        <h1 className="text-3xl font-extrabold">L&apos;Antre des Loutres</h1>
                    </Link>
                </div>
                <div className="mt-4 space-y-4">
                    <p className="text-lg text-justify">
                        <Link href="https://github.com/L-Antre-des-Loutres" className="text-blue-600 font-semibold hover:underline"> L&apos;Antre des loutres</Link> est une communauté dédiée aux passionnés de jeux vidéo.
                        Elle offre un espace où les joueurs peuvent se retrouver, échanger et trouver des partenaires de jeu.
                    </p>
                    <p className="text-justify">
                        Nous mettons également en place des services adaptés à nos utilisateurs, nous permettant ainsi de développer
                        des projets variés et innovants, exploités directement par notre communauté.
                    </p>
                    <p className="text-justify">
                        Grâce à nos serveurs de jeux auto-hébergés et administrés en interne, nous garantissons une grande liberté
                        dans les fonctionnalités proposées, sans passer par des services tiers.
                    </p>
                    <p className="text-justify">
                        Nos bots Discord, intégrés aux serveurs, permettent une interaction fluide : ouverture de sessions,
                        accès aux informations et gestion personnalisée grâce à des commandes dédiées.
                    </p>
                </div>
            </div>
        </div>
    );
}
