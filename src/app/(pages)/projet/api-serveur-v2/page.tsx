import Image from "next/image"; 
 
  export default function Projet() {
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">API-Serveur V2</h1>
                <p className="text-center text-lg">
                    Description du projet : La nouvelle version de l'API Serveur en TypeScript
                    <br />
                    Type d'application : API Rest
                    <br />
                    Framework utilisé : 
                    <br />
                    Module utilisé : Express
                    <br />
                    Langage(s) utilisé(s) : TypeScript
                    <br />
                    Statut : 1
                    <br />
                    Lien du repository : https://github.com/matheo-1712/API-Serveur-TS
                    <br />
                </p>
            </main>
        </div>
    );
}