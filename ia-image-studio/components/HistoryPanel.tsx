import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onUseSettings: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onUseSettings, onDelete, onClearAll }) => {
    if (!isOpen) return null;

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col text-white overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 id="history-title" className="text-2xl font-bold">📜 Histórico de Gerações</h2>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <button
                                onClick={() => {
                                    if(window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
                                        onClearAll();
                                    }
                                }}
                                className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                                aria-label="Limpar todo o histórico"
                            >
                                Limpar Tudo
                            </button>
                        )}
                        <button onClick={onClose} className="text-2xl p-1 rounded-full hover:bg-gray-700" aria-label="Fechar histórico">
                            &times;
                        </button>
                    </div>
                </header>
                
                <div className="p-4 flex-grow overflow-y-auto">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-xl">Nenhuma imagem gerada ainda.</h3>
                            <p>Seu histórico aparecerá aqui quando você criar imagens.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {history.map(item => (
                                <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                                    <img src={item.imageUrl} alt={item.prompt} className="w-full h-48 object-cover" loading="lazy" />
                                    <div className="p-3 flex flex-col flex-grow">
                                        <p className="text-xs text-gray-400 mb-1">{formatTimestamp(item.timestamp)}</p>
                                        <p className="text-sm font-medium text-gray-200 mb-2 flex-grow" title={item.prompt}>
                                            {item.prompt}
                                        </p>
                                        <div className="text-xs text-gray-300 space-y-1 mb-3">
                                            <p><span className="font-semibold capitalize">Função:</span> {item.createFunction}</p>
                                            <p><span className="font-semibold capitalize">Estilo:</span> {item.style}</p>
                                            <p><span className="font-semibold">Proporção:</span> {item.aspectRatio}</p>
                                        </div>
                                        <div className="mt-auto flex gap-2">
                                            <button 
                                                onClick={() => onUseSettings(item)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-2 rounded-md transition-colors"
                                            >
                                                Usar Config.
                                            </button>
                                            <button 
                                                onClick={() => onDelete(item.id)}
                                                className="bg-gray-600 hover:bg-gray-500 text-white p-1.5 rounded-md transition-colors"
                                                aria-label="Deletar item do histórico"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPanel;
