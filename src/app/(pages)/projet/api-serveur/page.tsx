import Image from "next/image"; 
 
  export default function Projet() {
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">API Serveur</h1>
                <p className="text-center text-lg">
                    Description du projet : Une API permettant la gestion de serveurs de jeu. Elle permet d'afficher l'ensemble des informations les concernant, de les installer, de les démarrer et de les arrêter via une requête.
                    <br />
                    Type d'application : API REST
                    <br />
                    Framework utilisé : 
                    <br />
                    Module utilisé : Express
                    <br />
                    Langage(s) utilisé(s) : JavaScript
                    <br />
                    Statut : 0
                    <br />
                    Lien du repository : https://github.com/matheo-1712/API-Serveur
                    <br />
                    Date de début : 24-06-2024
                    Date de fin : 28-10-2024
                </p>
            </main>
        </div>
    );
}