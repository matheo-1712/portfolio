import React, { useEffect } from 'react';

interface ParralaxBannerProps {
  imageUrl: string;
}

export default function ParralaxBanner({ imageUrl }: ParralaxBannerProps) {
  useEffect(() => {
    const handleScroll = () => {
      const parallax = document.getElementById("parallax-banner");
      const offset = window.scrollY;
      if (parallax) {
        parallax.style.backgroundPositionY = offset * 0.5 + "px";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); 
    };
  }, []);

  return (
    <section 
      id="parallax-banner"
      className="relative h-[40vh] md:h-[60vh] sm:h-[40vh] bg-cover bg-center bg-fixed z-1 w-full"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
    </section>
  );
}
