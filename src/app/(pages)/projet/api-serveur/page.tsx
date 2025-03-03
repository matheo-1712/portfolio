"use client";

import { useEffect, useState } from "react";
import { projectFetchById } from "@/app/components/Projet/projectFetch";
import { Project } from "@/app/components/Projet/interface";
import ProjetSummary from "@/app/components/Projet/components/projetSummary";
import BDDFlow from "@/app/components/ReactFlow/BDDFlow";

export default function Projet_apiServeur() {
    const [projectInfos, setProjectInfos] = useState<Project | undefined>(undefined);

    useEffect(() => {
        projectFetchById(6).then(data => setProjectInfos(data));
    }, []);

    return (
        <div className="items-center justify-center">
            {projectInfos && <ProjetSummary {...projectInfos} />}

            <div id="content" className="mt-12">
                <BDDFlow />
            </div>

            <div id="content" className="mt-12">
                test
            </div>
        </div>
    );
}
