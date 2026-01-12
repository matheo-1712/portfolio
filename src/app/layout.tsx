import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/Header/HeaderWrapper";
import Scroll from "./components/Function/Scroll";
import ThemeToggle from "./components/Button/themeButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pérodeau Mathéo - Portfolio",
  description: "Portfolio de Pérodeau Mathéo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'theme';
                  var classNameDark = 'dark';
                  var classNameLight = 'light';
                  
                  function setClassOnDocumentBody(darkMode) {
                    var d = document.documentElement;
                    d.classList.remove(classNameDark, classNameLight);
                    d.classList.add(darkMode ? classNameDark : classNameLight);
                  }
                  
                  var localStorageTheme = null;
                  try {
                    localStorageTheme = localStorage.getItem(storageKey);
                  } catch (err) {}
                  
                  var localStorageExists = localStorageTheme !== null;
                  if (localStorageExists) {
                    setClassOnDocumentBody(localStorageTheme === classNameDark);
                  } else {
                    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setClassOnDocumentBody(isDarkMode);
                  }
                } catch (err) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <Scroll />
        <HeaderWrapper />
        <main>
          <div className="min-h-screen mx-auto flex flex-col items-center">
            <div className="w-full max-w-[1600px] p-2">
              {/* Contenu de la page*/}
              {children}
            </div>
          </div>
        </main>
        <ThemeToggle />
      </body>
    </html >
  );
}
