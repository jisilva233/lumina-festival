
import React from 'react';
import type { ImageFilter } from '../types';

interface RightPanelProps {
    isLoading: boolean;
    loadingMessage: string;
    generatedImages: string[] | null;
    generatedVideoUrl: string | null;
    editCurrentImage: () => void;
    generateVariations: () => void;
    handleUpscale: () => void;
    canGenerateVariations: boolean;
    activeFilter: ImageFilter;
    setActiveFilter: (filter: ImageFilter) => void;
    error: string | null;
}

const imageFilters: { name: string; id: ImageFilter }[] = [
    { name: 'Original', id: 'none' },
    { name: 'Vívido', id: 'vivid' },
    { name: 'Mono', id: 'monochrome' },
    { name: 'Sépia', id: 'sepia' },
];

const getFilterClass = (filter: ImageFilter): string => {
    switch (filter) {
        case 'vivid': return 'saturate-150 contrast-125';
        case 'monochrome': return 'grayscale';
        case 'sepia': return 'sepia';
        case 'none':
        default: return '';
    }
};

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, loadingMessage, generatedImages, generatedVideoUrl, editCurrentImage, generateVariations, handleUpscale, canGenerateVariations, activeFilter, setActiveFilter, error }) => {
    
    const downloadImage = (imageUrl: string, index: number) => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-studio-image-${Date.now()}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadVideo = (videoUrl: string) => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `ai-studio-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const hasImages = generatedImages && generatedImages.length > 0;
    const hasVideo = generatedVideoUrl !== null;

    return (
        <div className="right-panel w-full lg:w-2/3 xl:w-3/4 bg-gray-900 flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-full h-full flex-grow flex items-center justify-center overflow-hidden">
                {!isLoading && !hasImages && !hasVideo && !error && (
                    <div id="resultPlaceholder" className="result-placeholder text-center text-gray-500">
                        <div className="result-placeholder-icon text-6xl mb-4">🎨</div>
                        <div className="text-xl">Sua obra de arte aparecerá aqui</div>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="error-display text-center p-6 bg-red-900/10 border border-red-800/30 rounded-xl max-w-md">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-400 mb-2">Ops! Algo deu errado</h3>
                        <p className="text-gray-400 text-sm">{error}</p>
                    </div>
                )}

                {isLoading && (
                    <div id="loadingContainer" className="loading-container text-center text-gray-400">
                        <div className="loading-spinner w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="loading-text text-xl">{loadingMessage}</div>
                    </div>
                )}

                {!isLoading && hasImages && (
                     <div className={`grid ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 w-full h-full overflow-y-auto`}>
                        {generatedImages.map((src, index) => (
                            <div key={index} className="relative group w-full h-full flex items-center justify-center min-h-[256px]">
                                <img src={src} alt={`Generated Art ${index + 1}`} className={`object-contain max-w-full max-h-full rounded-lg shadow-lg transition-all duration-300 ${getFilterClass(activeFilter)}`}/>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => downloadImage(src, index)} 
                                        title="Download" 
                                        className="action-btn text-2xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white transition-colors"
                                    >
                                        💾
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && hasVideo && (
                    <div className="w-full h-full flex items-center justify-center">
                        <video src={generatedVideoUrl} controls className="max-w-full max-h-full rounded-lg shadow-lg" />
                    </div>
                )}
            </div>
            
            {!isLoading && (hasImages || hasVideo) && (
                 <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    {hasImages && (
                         <div className="image-filters flex space-x-2 bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-lg">
                            {imageFilters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`text-sm p-2 px-3 rounded-md transition-colors ${
                                        activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="image-actions flex space-x-3 bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-lg">
                        {hasImages && (
                            <>
                                <button onClick={editCurrentImage} title="Editar Primeira Imagem" className="action-btn text-lg p-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2">
                                    <span>✏️</span>
                                    <span>Editar</span>
                                </button>
                                <button onClick={handleUpscale} title="Melhorar Resolução" className="action-btn text-lg p-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2">
                                    <span>🔎</span>
                                    <span>Upscale</span>
                                </button>
                                {canGenerateVariations && (
                                    <button onClick={generateVariations} title="Gerar Variações" className="action-btn text-lg p-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2">
                                        <span>🔄</span>
                                        <span>Variações</span>
                                    </button>
                                )}
                            </>
                        )}
                        {hasVideo && generatedVideoUrl && (
                             <button onClick={() => downloadVideo(generatedVideoUrl)} title="Baixar Vídeo" className="action-btn text-lg p-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2">
                                <span>💾</span>
                                <span>Baixar Vídeo</span>
                            </button>
                        )}
                    </div>
                 </div>
            )}
        </div>
    );
};

export default RightPanel;
