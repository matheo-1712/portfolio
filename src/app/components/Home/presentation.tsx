import Image from "next/image";

export default function Presentation() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center max-w-7xl mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                {/* Section texte */}
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold">Bonjour et bienvenue sur mon portfolio !</h1>
                    <p className="text-justify text-lg mt-4">
                        Je suis Pérodeau Mathéo, développeur encore en apprentissage. Ce site est une vitrine de mon travail, où vous pourrez découvrir mes projets, en apprendre davantage sur mes compétences et suivre mon évolution dans le domaine du développement.

                        Ce portfolio a été conçu et développé entièrement par mes soins, en utilisant Next.js.

                        Que vous soyez un recruteur, un passionné de développement ou simplement curieux, n’hésitez pas à explorer mes réalisations et à me contacter pour échanger ! Bonne visite !🚀
                    </p>
                </div>

                {/* Section image */}
                <div className="flex-1 flex justify-center items-center mt-6 sm:mt-0">
                    <Image
                        className="w-full sm:w-auto max-w-xs"
                        src="/matheo.png"
                        width={500}
                        height={500}
                        alt="Image Description"
                    />
                </div>
            </div>
        </div>
    );
}
