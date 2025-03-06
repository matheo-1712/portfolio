"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/project_informations/projetSummary";

export default function Projet_Otterminded() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(5).then(data => setProjectInfos(data));
    }, []);

     return (
            <div className="items-center justify-center">
                {projectInfos && <ProjetSummary {...projectInfos} />}
    
                {/* Move content section below with more margin */}
                <div id="content" className="mt-12">
                    <p>Page en construction...</p>
                </div>
            </div>
        );
}
