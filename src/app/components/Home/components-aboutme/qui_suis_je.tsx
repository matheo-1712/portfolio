import Image from "next/image";

export default function QuiSuisJe() {
    return (
        <div id="Qui suis je" className="w-full p-2">
            <div className="w-full p-2 px-2 flex flex-col md:flex-row gap-4">
                {/* Colonne de gauche */}
                <div className="md:w-full">
                    <p className="text-justify">
                        Je suis Mathéo, développeur depuis bientôt 3 ans. Je réalise l&apos;ensemble des idées et des projets qui me viennent en tête avec passion et amusement, toujours prêt à découvrir de nouvelles technologies et de nouveaux langages.
                        D&apos;ailleurs mon langage préféré est TypeScript.
                    </p>
                    <br />
                    <p className="text-justify">
                        J&apos;aime le développement, car il me permet de créer, d&apos;automatiser et de concevoir des applications, dont la seule limite est celle de l&apos;informatique.
                    </p>
                    <br />
                    <p className="text-justify">
                        Pour moi rien n&apos;est impossible à réaliser en informatique, je trouve que le métier de développeur ressemble beaucoup à celui d&apos;un artiste, on crée une oeuvre complexe mais que seulement certains élus peuvent comprendre.
                    </p>
                    <br/>
                    <p className="flex flex-col sm:flex-row gap-4 text-blue-600 font-semibold text-lg">
                        <a
                            href="/cv.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-200 hover:text-blue-800 hover:underline hover:scale-105"
                        >
                            📄 Mon CV
                        </a>
                        <a
                            href="https://github.com/matheo-1712"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-200 hover:text-blue-800 hover:underline hover:scale-105"
                        >
                            💻 Mon GitHub
                        </a>
                    </p>
                </div>

                {/* Colonne de droite */}
                <div className="md:w-1/3 flex flex-col justify-center items-center">
                    <Image
                        src="/matheo_sprite.png"
                        alt="Sprite"
                        width={150}
                        height={150}
                        className="hover:scale-105 transition-transform duration-300 ease-in-outs"
                    />
                    <span className="ml-10 mt-2 text-sm text-gray-600">Un pixel art réalisé par moi même</span>
                </div>
            </div>
        </div>);
}