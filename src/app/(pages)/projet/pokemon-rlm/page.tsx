import Image from "next/image"; 
 
  export default function Projet() {
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">pokemon-rlm</h1>
                <p className="text-center text-lg">
                    Description du projet : Un fangame Pokémon modeste, se déroulant sur l'Île de Loutre Mer...
                    <br />
                    Type d'application : Jeu
                    <br />
                    Framework utilisé : PSDK
                    <br />
                    Module utilisé : PSDK
                    <br />
                    Langage(s) utilisé(s) : Ruby
                    <br />
                    Statut : 1
                    <br />
                    Lien du repository : https://github.com/L-Antre-des-Loutres/Pokemon-RLM
                    <br />
                </p>
            </main>
        </div>
    );
}