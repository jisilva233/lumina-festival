
import React from 'react';

interface FunctionCardProps {
    icon: string;
    name: string;
    isActive: boolean;
    onClick: () => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`function-card flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                isActive ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700 border-transparent hover:bg-gray-600/50'
            }`}
        >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-sm font-medium">{name}</div>
        </div>
    );
};

export default FunctionCard;
