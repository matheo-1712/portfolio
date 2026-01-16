import React from 'react';
import DiscordMessage from './DiscordMessage';

/**
 * Structure des données d'un message pour la liste.
 */
interface MessageData {
    /** Identifiant unique du message */
    id: string;
    /** Nom de l'auteur */
    author: string;
    /** Avatar de l'auteur */
    avatar: string;
    /** Contenu du message */
    content: React.ReactNode;
    /** Date/Heure du message */
    timestamp: string;
    /** Couleur du nom de l'auteur */
    roleColor?: string;
    /** Est-ce un bot ? */
    isBot?: boolean;
    /** Tag du bot (ex: "APP") */
    botTag?: string; // Added botTag to interface
}

/**
 * Props du composant DiscordDiscussion.
 */
interface DiscordDiscussionProps {
    /** Liste des messages à afficher */
    messages: MessageData[];
}

/**
 * Conteneur principal pour une discussion Discord.
 * Affiche une liste de messages dans un style sombre.
 */
const DiscordDiscussion: React.FC<DiscordDiscussionProps> = ({ messages }) => {
    return (
        <div className="bg-[#36393f] rounded-lg p-4 font-sans border border-[#202225] shadow-lg my-6">
            <div className="flex flex-col space-y-0.5">
                {messages.map((msg) => (
                    <DiscordMessage
                        key={msg.id}
                        author={msg.author}
                        avatar={msg.avatar}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        roleColor={msg.roleColor}
                        isBot={msg.isBot}
                        botTag={msg.botTag} // Pass botTag prop
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscordDiscussion;
