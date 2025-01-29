import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/header";

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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="pt-4 pb-8">
          <Header />
        </header>
        <main>
          <div className="min-h-screen mx-auto flex flex-col items-center">
            <div className="w-full max-w-7xl p-2">
              {/* Contenu de la page*/}
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
