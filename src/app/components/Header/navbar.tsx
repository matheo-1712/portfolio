import Image from "next/image";
import Logo from "../../public/svg/logo.svg";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="fixed top-0 z-50 flex items-center justify-between ml-2 py-4 px-4 shadow-md">
        <Link href="/">
          <Image
            className="dark:invert cursor-pointer"
            src={Logo}
            alt="Logo"
            height={30}
            priority
          />
        </Link>
      </div>
    );
  }
  
      
    
      