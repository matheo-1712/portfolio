import ZoomImage from "./zoomImage";

interface ImageData {
    src: string;
    caption: string;
}

interface GalleryZoomImageProps {
    images: ImageData[]; // Tableau d'objets contenant src et caption
}

export default function GalleryZoomImage({ images }: GalleryZoomImageProps) {
    return (
        <div id="gallery-zoom-image" className="p-6">
            <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <ZoomImage src={image.src} />
                        <span className="mt-2 text-sm">{image.caption}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
