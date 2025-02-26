import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./themetoogle";

export default function Navbar() {
  return (
    <div className="sticky md:fixed top-0 z-50 flex items-center justify-between py-4 px-4 w-full">
      <Link href="/">
        <Image
          className="dark:invert cursor-pointer"
          src="/svg/logo.svg"
          alt="Logo"
          height={30}
          width={240}
          priority
        />
      </Link>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
