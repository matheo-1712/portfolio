"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";



export default function ZoomImage({ src, alt = "Projet", className = "w-full h-auto" }: { src: string; alt?: string; className?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [isZoomed, setIsZoomed] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            setIsZoomed(false);
        }, 300); // Durée de l'animation
    };

    return (
        <>
            {/* Image affichée normalement */}
            <div
                className={`${className} cursor-pointer rounded-lg group overflow-hidden relative`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    width={2000}
                    height={2000}
                />

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                </div>
            </div>

            {/* Modal via Portal */}
            {isOpen && mounted && createPortal(
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"} ${isZoomed ? "overflow-auto items-start p-0" : "overflow-hidden p-4"}`}
                    onClick={handleClose}
                >
                    {/* Bouton Fermer */}
                    <button
                        className="fixed top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-[10000] text-4xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    >
                        &times;
                    </button>

                    <div
                        className={`relative transition-all duration-300 ${isZoomed ? "w-full min-h-full flex justify-center bg-black" : "w-auto h-auto max-w-full max-h-full flex items-center justify-center"}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                    >
                        <Image
                            src={src}
                            alt={`Zoomed ${alt}`}
                            width={3840} // Augmenté pour haute qualité
                            height={2160}
                            className={`transition-all duration-300 rounded-sm shadow-2xl !m-0 !border-0 ${isZoomed
                                ? "object-contain w-auto h-auto min-w-full cursor-zoom-out"
                                : "object-contain max-w-full max-h-[90vh] w-auto h-auto cursor-zoom-in"
                                }`}
                            priority
                            unoptimized={true} // Avoid potential conflicts with optimized images in modals sometimes
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
