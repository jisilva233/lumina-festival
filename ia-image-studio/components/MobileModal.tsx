
import React from 'react';
import type { ImageFilter } from '../types';

interface MobileModalProps {
    imageSrcs: string[] | null;
    videoSrc: string | null;
    onEdit: () => void;
    onNewContent: () => void;
    generateVariations: () => void;
    onUpscale: () => void;
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


const MobileModal: React.FC<MobileModalProps> = ({ imageSrcs, videoSrc, onEdit, onNewContent, generateVariations, onUpscale, canGenerateVariations, activeFilter, setActiveFilter, error }) => {
    const hasImages = imageSrcs && imageSrcs.length > 0;
    const hasVideo = videoSrc !== null;

    if (!hasImages && !hasVideo && !error) return null;

    const downloadImage = (imageSrc: string) => {
        if (!imageSrc) return;
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `ai-studio-image-${Date.now()}.png`;
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

    return (
        <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black bg-opacity-90 flex flex-col p-4 z-50">
            <div className="modal-content flex-grow flex flex-col items-center justify-center min-h-0">
                {error && !hasImages && !hasVideo && (
                    <div className="error-display text-center p-6 bg-red-900/20 border border-red-800/40 rounded-xl">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-400 mb-2">Ops!</h3>
                        <p className="text-gray-300 text-sm">{error}</p>
                        <button onClick={onNewContent} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Voltar</button>
                    </div>
                )}
                
                {hasImages && (
                     <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                        {imageSrcs.map((src, index) => (
                            <div key={index} className="relative snap-center flex-shrink-0 w-full h-full flex items-center justify-center">
                                <img id={`modalImage-${index}`} src={src} alt="Generated Art" className={`modal-image object-contain max-w-full max-h-full rounded-lg transition-all duration-300 ${getFilterClass(activeFilter)}`} />
                                <button onClick={() => downloadImage(src)} title="Download" className="absolute top-2 right-2 action-btn text-2xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white transition-colors">💾</button>
                            </div>
                        ))}
                    </div>
                )}
                {hasVideo && (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <video src={videoSrc} controls className="modal-video object-contain max-w-full max-h-full rounded-lg" />
                        <button onClick={() => downloadVideo(videoSrc)} title="Download" className="absolute top-2 right-2 action-btn text-2xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white transition-colors">💾</button>
                    </div>
                )}
            </div>
            
            {(hasImages || hasVideo) && (
                <div className="flex-shrink-0">
                    {hasImages && (
                        <div className="modal-filters flex justify-center space-x-2 p-2">
                            {imageFilters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`text-xs font-bold py-2 px-3 rounded-lg transition-colors ${
                                        activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="modal-actions grid grid-cols-2 gap-2 p-4 pt-2">
                        {hasImages && (
                            <>
                                 <button onClick={onEdit} className="col-span-1 modal-btn edit flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                                    ✏️ Editar
                                </button>
                                <button onClick={onUpscale} className="col-span-1 modal-btn upscale flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                                    🔎 Upscale
                                </button>
                                {canGenerateVariations && (
                                    <button onClick={generateVariations} className="col-span-1 modal-btn variations flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                                        🔄 Variações
                                    </button>
                                )}
                            </>
                        )}
                        <button onClick={onNewContent} className="col-span-2 modal-btn new flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                            ✨ {hasVideo ? 'Novo Vídeo' : 'Nova Imagem'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileModal;
