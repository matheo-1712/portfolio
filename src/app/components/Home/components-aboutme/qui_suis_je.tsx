import Image from "next/image";

export default function QuiSuisJe() {
    return (
        <div id="quisuisje">
            <p className="text-justify">
                Je suis Mathéo, développeur depuis bientôt 3 ans. Je réalise l&apos;ensemble des idées et des projets qui me viennent en tête avec passion et amusement, toujours prêt à découvrir de nouvelles technologies et de nouveaux langages.
                D&apos;ailleurs mon langage préféré est
                <span className="inline-flex items-center gap-2 ml-1">
                    TypeScript
                    <Image
                        src="/svg/typescript.svg"
                        alt="Logo TypeScript"
                        height={25}
                        width={22}
                        priority
                    />
                </span>
            </p>
            <br />
            <p className="text-justify">
                J&apos;aime le développement, car il me permet de créer, d&apos;automatiser et de concevoir des applications, dont la seule limite est celle de l&apos;informatique.
            </p>
            <br />
            <p className="text-justify">
                Pour moi rien est impossible à réaliser en informatique, je trouve que le métier de développeur ressemble beaucoup à celui d&apos;un artiste, on crée une oeuvre complexe mais que seulement certains élu peuvent comprendre.
            </p>
        </div>
    );
}
