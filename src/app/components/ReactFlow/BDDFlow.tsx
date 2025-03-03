import React from 'react';
import { ReactFlow, Background, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    {
        id: 'users',
        position: { x: -150, y: -100 },
        data: {
            label: 'users',
            details: 'id (PK), id_discord, uid_genshin'
        },
        type: 'default'
    },
    {
        id: 'uid_infos',
        position: { x: 150, y: -100 },
        data: {
            label: 'uid_infos',
            details: 'id (PK), uid (FK), nickname, level, signature, worldLevel, playerIcon'
        },
        type: 'default'
    },
    {
        id: 'players_characters',
        position: { x: -150, y: 50 },
        data: {
            label: 'players_characters',
            details: 'id (PK), uid_genshin (FK), character_id (FK), name, element, level'
        },
        type: 'default'
    },
    {
        id: 'characters',
        position: { x: 150, y: 50 },
        data: {
            label: 'characters',
            details: 'id (PK), name, weapon, vision, region, portraitLink, value'
        },
        type: 'default'
    },
    {
        id: 'infographics',
        position: { x: 0, y: 200 },
        data: {
            label: 'infographics',
            details: 'id (PK), character (FK), build, url'
        },
        type: 'default'
    },
];

const initialEdges = [
    { id: 'e1', source: 'users', target: 'uid_infos', label: 'uid_genshin → uid' },
    { id: 'e2', source: 'players_characters', target: 'users', label: 'uid_genshin → uid_genshin' },
    { id: 'e3', source: 'players_characters', target: 'characters', label: 'character_id → id' },
    { id: 'e4', source: 'infographics', target: 'characters', label: 'character → name' },
];

export default function BDDSchemaFlow() {

    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className='w-full h-screen flex justify-center items-center p-4'>
            <div className='w-full h-full border rounded-lg shadow-lg'>
                <ReactFlow
                    edges={edges}
                    // onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodes={initialNodes.map(node => ({
                        ...node,
                        data: {
                            label: (
                                <div className='text-center'>
                                    <strong>{node.data.label}</strong>
                                    <br />
                                    <span className='text-xs text-gray-600'>{node.data.details}</span>
                                </div>
                            )
                        }
                    }))}
                    fitView
                >
                    <Background variant='dots' gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
