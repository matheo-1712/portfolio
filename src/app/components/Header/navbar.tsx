import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between ml-2 py-4 px-4 shadow-md">
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
    </div>
  );
}



