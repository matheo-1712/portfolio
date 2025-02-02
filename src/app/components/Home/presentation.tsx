import Image from "next/image";

export default function Presentation() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center max-w-7xl mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                {/* Section texte */}
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-4xl font-bold">Présentation</h1>
                    <p className="text-justify text-lg mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        tristique, nulla et aliquam lacinia, elit diam egestas augue, ac
                        facilisis nisi nisl eu libero. Sed euismod, nisl at blandit
                        consectetur, nunc nisi tincidunt nisl, in consequat nisi nisl eu
                        libero. Sed euismod, nisl at blandit consectetur, nunc nisi
                        tincidunt nisl, in consequat nisi nisl eu libero. Sed euismod,
                        nisl at blandit consectetur, nunc nisi tincidunt nisl, in
                        consequat nisi nisl eu libero.
                    </p>
                </div>
                
                {/* Section image */}
                <div className="flex-1 flex justify-center items-center mt-6 sm:mt-0">
                    <Image
                        className="w-full sm:w-auto max-w-xs"
                        src="/img/placeholder.png"
                        width={500}
                        height={500}
                        alt="Image Description"
                    />
                </div>
            </div>
        </div>
    );
}
