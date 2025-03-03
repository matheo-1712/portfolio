"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/components/projetSummary";

export default function Projet_apiServeur() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(6).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <p>Page en construction...</p>
                <p>Page en construction...</p>
                <p>Page en construction...</p>
                <p>Page en construction...</p>
            </div>
        </div>
    );
}
