import Image from "next/image";
import Logo from "../public/svg/logo.svg";

export default function Header() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:space-x-4 mt-6 mb-6 ml-6">
    <Image className="dark:invert" src={Logo} alt="Next.js logo" height={30} priority />
  </div>
  );
}

