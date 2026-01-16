"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ZoomImageProps {
    src: string;
}

export default function ZoomImage({ src }: ZoomImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

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
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300); // Durée de l'animation
    };

    return (
        <>
            {/* Image affichée normalement */}
            <div
                className="w-full h-full cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt="Projet"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    width={2000}
                    height={2000}
                />
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isClosing ? "bg-black/0 opacity-0" : "bg-black/90 opacity-100"
                        }`}
                    onClick={handleClose}
                >
                    {/* Bouton Fermer */}
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50 text-4xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    >
                        &times;
                    </button>

                    <div
                        className={`relative w-auto h-auto max-w-[98vw] max-h-[98vh] transition-transform duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt="Zoomed Projet"
                            width={3840} // Augmenté pour haute qualité
                            height={2160}
                            className="object-contain max-h-[98vh] w-auto h-auto rounded-sm shadow-2xl"
                            style={{ minWidth: "50vw" }} // Assure une taille minimale décente
                            priority
                        />
                    </div>
                </div>
            )}
        </>
    );
}
