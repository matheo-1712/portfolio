import { useState, useEffect } from "react";
import Image from "next/image";

interface ZoomImageProps {
    src: string;
}

export default function ZoomImage({ src }: ZoomImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale] = useState(1);

    // Bloquer le défilement de la page lorsque le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Fermer le modal si on appuie sur la touche Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div id="zoom-image">
            {/* Image affichée normalement */}
            <div className="w-full h-full cursor-pointer" onClick={() => setIsOpen(true)}>
                <Image src={src} alt="Projet" className="object-contain hover:scale-105 transition-transform duration-300 ease-in-outs" width={2000} height={2000} />
            </div>

            {/* Modal avec barre de défilement sur le côté */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative max-w-screen max-h-screen overflow-auto p-4"
                        style={{ scrollbarGutter: "stable" }} // Garde l'espace du scroll toujours stable
                    >
                        <Image
                            src={src}
                            alt="Zoomed Projet"
                            width={2000}
                            height={2000}
                            style={{ transform: `scale(${scale})`, transition: "transform 0.2s ease-in-out" }}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
