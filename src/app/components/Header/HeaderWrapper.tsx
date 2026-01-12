"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    if (isHomePage) {
        return null;
    }

    return (
        <header className="pt-4 pb-8">
            <Header />
        </header>
    );
}
