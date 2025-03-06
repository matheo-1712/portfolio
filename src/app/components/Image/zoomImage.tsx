import { useState, useEffect } from "react";
import Image from "next/image";

interface ZoomImageProps {
    src: string;
}

export default function ZoomImage({ src }: ZoomImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale] = useState(1);

    // TODO Gérer le zoom avec la molette de la souris
    /*const handleZoom = (event: React.WheelEvent) => {
        event.preventDefault();
        setScale((prevScale) => Math.min(3, Math.max(1, prevScale + event.deltaY * -0.001)));
    };*/

    // Bloquer le défilement de la page lorsque le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Nettoyage au démontage
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

     // Fermer le modal si on appuie sur la touche Escape
     useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false); // Ferme le modal
            }
        };

        // Ajoute l'écouteur d'événements
        document.addEventListener("keydown", handleKeyDown);

        // Nettoyage de l'écouteur d'événements
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div id="zoom-image">
            {/* Image affichée normalement */}
            <div className="w-full h-full cursor-pointer" onClick={() => setIsOpen(true)}>
                <Image src={src} alt="Projet" className="object-contain" width={2000} height={2000} />
            </div>

            {/* Modal en plein écran */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="relative max-w-[90%] max-h-[90%] overflow-hidden">
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
