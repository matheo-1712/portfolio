import ZoomImage from "./zoomImage";

interface ImageData {
    src: string;
    caption: string;
}

interface GalleryZoomImageProps {
    images: ImageData[];
}

export default function GalleryZoomImage({ images }: GalleryZoomImageProps) {
    return (
        <div id="gallery-zoom-image" className="py-8">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-neutral-900 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out border border-white/5"
                    >
                        {/* Wrapper pour l'image */}
                        <div className="relative">
                            <ZoomImage src={image.src} />
                        </div>

                        {/* Overlay Caption avec Glassmorphism */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/60 backdrop-blur-md border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 pointer-events-none">
                            <p className="text-sm font-medium text-white/90 text-center drop-shadow-sm">
                                {image.caption}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
