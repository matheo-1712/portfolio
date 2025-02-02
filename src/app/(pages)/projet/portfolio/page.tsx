import Image from "next/image"; 
 
  export default function Projet() {
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">portfolio</h1>
                <p className="text-center text-lg">
                    Description du projet : Mon portfolio professionnel présentant mes projets actuels, passés et futurs.
                    <br />
                    Type d'application : Site Web
                    <br />
                    Framework utilisé : React
                    <br />
                    Module utilisé : 
                    <br />
                    Langage(s) utilisé(s) : Type Script
                    <br />
                    Statut : 1
                    <br />
                    Lien du repository : https://github.com/matheo-1712/portfolio
                    <br />
                </p>
            </main>
        </div>
    );
}