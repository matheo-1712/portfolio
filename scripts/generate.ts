// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const readline = require("readline");

// Définition de l'interface Project
export type Project = {
  nom: string;
  type: string;
  image: string;
  description: string;
  language_prog: string;
  statut: string;
  repository: string;
  framework: string;
  module: string;
  url: string;
  date_debut: string;
  date_fin: string;
}

// Chemin vers le fichier JSON
const jsonFilePath = path.join(
  "./public/projets.json"
);

// Fonction pour poser une question
const askQuestion = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (answer: string) => {
    rl.close();
    resolve(answer.trim());
  }));
};

// Fonction pour choisir un statut
const askStatus = async (): Promise<string> => {
  console.log("\nChoisissez un statut :");
  console.log("0 - Terminé");
  console.log("1 - En cours");
  console.log("2 - À venir");

  let status: string;
  do {
    status = await askQuestion("Entrez le numéro du statut : ");
  } while (!["0", "1", "2"].includes(status));

  return status;
};

// Fonction principale
const addProject = async () => {
  console.log("\n=== Ajout d'un nouveau projet ===");

  // Charger le fichier JSON existant ou initialiser un tableau vide
  let projects: Project[] = [];

  // Demander le nom du projet
  const nom = await askQuestion("Nom du projet : ");

  // Vérifier si le projet existe déjà dans le fichier JSON
  if (fs.existsSync(jsonFilePath)) {
    const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
    try {
      const parsedContent = JSON.parse(fileContent);

      // Si le contenu est un tableau, on vérifie la présence du nom
      if (Array.isArray(parsedContent)) {
        projects = parsedContent;
      } else {
        console.log("Le fichier JSON est mal formaté, réinitialisation...");
        projects = [];
      }
    } catch (err) {
      console.log("Erreur de lecture du fichier JSON, réinitialisation... :", err);
      projects = [];
    }
  } else {
    console.log("Le fichier JSON n'existe pas, création de projets...");
    projects = [];
  }

  // Vérifier si le nom du projet existe déjà
  const existingProject = projects.find((project) => project.nom.toLowerCase() === nom.toLowerCase());
  if (existingProject) {
    console.log("\n❌ Le nom du projet existe déjà, veuillez en choisir un autre.");
    return; // Annuler l'ajout si le nom est déjà pris
  }

  // Si le nom est unique, on poursuit
  const image = await askQuestion("Lien de l'image (laisser vide si non dispo) : ");
  const type = await askQuestion("Type d'application (projet, bot, site) : ");
  const repository = await askQuestion("Lien du repository (laisser vide si non dispo) : ");
  const description = await askQuestion("Description du projet : ");
  const language_prog = await askQuestion("Langage(s) utilisé(s) : ");
  const usedModule = await askQuestion("Module utilisé (laisser vide si non utilisé) : ");
  const framework = await askQuestion("Framework utilisé (laisser vide si non utilisé) : ");
  const statut = await askStatus();
  const url = "/projet/" + nom.toLowerCase().replaceAll(" ", "-").replaceAll("é", "e").replaceAll("è", "e");
  const date_debut = await askQuestion("Date de début : ");
  const date_fin = await askQuestion("Date de fin (laisser vide si non dispo) : ") || "XX-XX-XXXX"; // Remplacer par XXXX-XX-XX si date_fin n'est pas renseignée

  // Ajouter le nouveau projet
  const newProject: Project = {
    nom,
    type,
    image,
    description,
    language_prog,
    module : usedModule,
    repository,
    statut,
    framework,
    url,
    date_debut,
    date_fin,
  };
  projects.push(newProject);

  // Sauvegarder dans le fichier JSON
  fs.writeFileSync(jsonFilePath, JSON.stringify(projects, null, 2));
  console.log("\n✅ Projet ajouté avec succès !");

  // Création du dossier pour le projet
  const projectDir = path.join(
    "./src/app/(pages)/projet/",
    nom.toLowerCase().replaceAll(" ", "-").replaceAll("é", "e").replaceAll("è", "e")
  );
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  console.log("\n✅ Dossier créé avec succès !");

  // Création du fichier page.tsx pour le projet
  const pageContent = `import Image from "next/image"; \n 
  export default function Projet() {
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">${nom}</h1>
                <p className="text-center text-lg">
                    Description du projet : ${description}
                    <br />
                    Type d'application : ${type}
                    <br />
                    Framework utilisé : ${framework}
                    <br />
                    Module utilisé : ${usedModule}
                    <br />
                    Langage(s) utilisé(s) : ${language_prog}
                    <br />
                    Statut : ${statut}
                    <br />
                    Lien du repository : ${repository}
                    <br />
                    Date de début : ${date_debut}
                    Date de fin : ${date_fin}
                </p>
            </main>
        </div>
    );
}`;

  fs.writeFileSync(path.join(projectDir, "page.tsx"), pageContent);
  console.log("\n✅ Fichier page.tsx créé avec succès !");
};

// Lancer le script
addProject();
