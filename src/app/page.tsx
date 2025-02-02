import Presentation from "./components/Home/presentation";
import AboutMe from "./components/Home/aboutme";
import { Project } from "./components/Projet/project";

export default function Home() {
  return (
    <div>      
      <Presentation />
      <AboutMe />

      <Project statut="1" />
      <Project statut="2" />
      <Project statut="0" />
    </div>
  );
}
