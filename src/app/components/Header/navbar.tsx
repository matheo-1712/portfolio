import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Projets', path: '/projet' },
    { name: 'Parcours', path: '/parcours' }
  ];

  return (
    <nav className="pointer-events-auto bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-full px-2 py-2 flex items-center gap-1 transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-black/80 ring-1 ring-black/5 dark:ring-white/10">

      {/* Name Section */}
      <span className="pl-4 pr-1 text-sm font-bold text-gray-800 dark:text-gray-200 hidden sm:block">
        Pérodeau Mathéo
      </span>

      <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1"></div>

      {/* Home Button */}
      <Link
        href="/"
        className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
        title="Retour à l'accueil"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>

      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1"></div>

      {/* Navigation Links */}
      <div className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center
                ${isActive
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white dark:bg-black rounded-full opacity-50"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
