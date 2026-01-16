import React from 'react';
import DiscordDiscussion from '../DiscordDiscussion';

/**
 * Composant de démonstration montrant une interaction OtterGuard.
 * Simule la suppression d'un message d'arnaque.
 */
const OtterbotsDemo = () => {
    const messages = [
        {
            id: '1',
            author: 'RereBleue',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            content: <span className="text-gray-300">free nitro</span>,
            timestamp: "Hier à 11:42",
            roleColor: '#e74c3c', // Reddish role color for RereBleue
            isBot: false,
        },
        {
            id: '2',
            author: 'Oldisoutre',
            avatar: '/otterbots.png', // Assuming this image exists
            content: (
                <div className="bg-[#2f3136] border-l-4 border-[#ed4245] rounded p-4 mt-1 max-w-lg">
                    <div className="flex items-center mb-2">
                        {/* Shield icon simulation */}
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-gray-300 text-sm">OtterGuard Moderation</span>
                    </div>
                    <div className="font-bold text-white text-base mb-2">
                        Message d&#39;arnaque supprimé par OtterGuard
                    </div>

                    <div className="mb-3">
                        <div className="font-bold text-white text-sm mb-1">Reason:</div>
                        <div className="text-gray-300 text-sm">
                            Le message de <span className="bg-[#5865f2]/30 text-[#dae0fc] px-1 rounded hover:bg-[#5865f2]/50 cursor-pointer transition-colors">@RereBleue</span> détecté comme une arnaque potentielle a été supprimé.
                        </div>
                    </div>

                    <div className="mb-1">
                        <div className="font-bold text-white text-sm mb-1 flex items-center">
                            📝 Context / Content
                        </div>
                        <div className="text-gray-300 text-sm">
                            free nitro
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                        Otterguard - Moderation Team • Hier à 11:43
                    </div>
                </div>
            ),
            timestamp: "Hier à 11:43",
            roleColor: '#e74c3c', // Reddish role color used for the bot name in the screenshot (Oldisoutre)
            isBot: true,
            botTag: "APP"
        }
    ];

    return <DiscordDiscussion messages={messages} />;
};

export default OtterbotsDemo;
