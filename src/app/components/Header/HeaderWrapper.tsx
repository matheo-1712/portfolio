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
        <>
            {/* Spacer to prevent content from being hidden behind the fixed header */}
            <div className="h-32 w-full" aria-hidden="true" />

            <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
                <Header />
            </header>
        </>
    );
}
