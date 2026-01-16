import React from 'react';
import Image from "next/image";

/**
 * Props du composant DiscordMessage.
 */
interface DiscordMessageProps {
    /** Nom de l'auteur du message */
    author: string;
    /** URL de l'avatar de l'auteur (ou chemin local) */
    avatar: string;
    /** Contenu du message (Texte, JSX, Embeds...) */
    content: React.ReactNode;
    /** Horodatage affiché à côté du nom (ex: "Aujourd'hui à 14:30") */
    timestamp: string;
    /** Couleur du rôle de l'auteur (hexadécimal). Par défaut: blanc (#ffffff) */
    roleColor?: string;
    /** Si true, affiche un badge "BOT" (ou autre tag défini) à côté du nom */
    isBot?: boolean;
    /** Texte du badge bot (ex: "BOT", "APP", "SYSTEM"). Par défaut: "BOT" */
    botTag?: string;
}

/**
 * Composant pour afficher un message individuel style Discord.
 */
const DiscordMessage: React.FC<DiscordMessageProps> = ({ author, avatar, content, timestamp, roleColor = "#ffffff", isBot = false, botTag = "BOT" }) => {
    return (
        <div className="flex items-start space-x-4 py-1 hover:bg-[#32353b]/30 px-2 rounded -mx-2 bg-transparent transition-colors">
            <div className="flex-shrink-0 mt-0.5">
                <Image
                    src={avatar}
                    alt={`${author} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full bg-gray-700"
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-[16px] hover:underline cursor-pointer" style={{ color: roleColor }}>
                        {author}
                    </span>
                    {isBot && (
                        <span className="bg-[#5865f2] text-white text-[10px] px-1.5 py-[1px] rounded-[3px] font-medium flex items-center h-[15px] leading-none">
                            {botTag}
                        </span>
                    )}
                    <span className="text-xs text-gray-400 font-normal">
                        {timestamp}
                    </span>
                </div>
                <div className="text-gray-300 text-[15px] leading-[1.375rem] whitespace-pre-wrap font-light">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default DiscordMessage;
