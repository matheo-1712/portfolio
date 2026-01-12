import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="sticky md:fixed top-0 z-50 flex items-center justify-between py-4 px-4 w-full backdrop-blur-sm bg-white/70 dark:bg-black/50 transition-colors duration-300">
      <Link href="/" className="hover:scale-105 transition-transform duration-300">
        <Image
          className="dark:invert cursor-pointer"
          src="/svg/logo.svg"
          alt="Logo"
          height={30}
          width={240}
          priority
        />
      </Link>

      <div className="flex items-center gap-6 ml-auto">
        <nav className="hidden md:flex gap-6">
          <Link
            href="/projet"
            className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Projets
          </Link>
        </nav>
      </div>
    </div>
  );
}
