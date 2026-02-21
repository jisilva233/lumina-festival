
import React, { useState } from 'react';
import type { Mode, CreateFunction, EditFunction, ImageFile, AspectRatio, ImageStyle, VideoResolution } from '../types';
import FunctionCard from './FunctionCard';
import UploadArea from './UploadArea';
import { translateText } from '../services/geminiService';

interface LeftPanelProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    activeCreateFunction: CreateFunction;
    setActiveCreateFunction: (func: CreateFunction) => void;
    activeEditFunction: EditFunction;
    setActiveEditFunction: (func: EditFunction) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    activeStyle: ImageStyle;
    setActiveStyle: (style: ImageStyle) => void;
    showComposeUploader: boolean;
    showPhotoRestorationUploader: boolean;
    backToEditFunctions: () => void;
    handleImageUpload: (file: File, imageIndex: 1 | 2) => void;
    image1: ImageFile | null;
    image2: ImageFile | null;
    generate: (restorationAction?: 'restore' | 'coloring') => Promise<void>;
    isLoading: boolean;
    error: string | null;
    onHistoryToggle: () => void;
    videoResolution: VideoResolution;
    setVideoResolution: (res: VideoResolution) => void;
    hasApiKey: boolean;
    onSelectApiKey: () => void;
}

const createFunctions: { name: string; icon: string; id: CreateFunction; }[] = [
    { name: 'Prompt', icon: '✨', id: 'free' },
    { name: 'Adesivos', icon: '🏷️', id: 'sticker' },
    { name: 'Logo', icon: '📝', id: 'text' },
    { name: 'HQ', icon: '💭', id: 'comic' },
];

const editFunctions: { name: string; icon: string; id: EditFunction; }[] = [
    { name: 'Adicionar', icon: '➕', id: 'add-remove' },
    { name: 'Retoque', icon: '🎯', id: 'retouch' },
    { name: 'Estilo', icon: '🎨', id: 'style' },
    { name: 'Restaurar', icon: '🪄', id: 'photo-restoration' },
    { name: 'Unir', icon: '🖼️', id: 'compose' },
    { name: 'Remover Fundo', icon: '✂️', id: 'background-removal' },
];

const aspectRatios: { label: string; value: AspectRatio }[] = [
    { label: '1:1', value: '1:1' },
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
    { label: '4:3', value: '4:3' },
    { label: '3:4', value: '3:4' },
];

const videoAspectRatios: { label: string; value: AspectRatio }[] = [
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
];

const videoResolutions: { label: string; value: VideoResolution }[] = [
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' },
];

const imageStyles: { name: string; icon: string; id: ImageStyle; }[] = [
    { name: 'Nenhum', icon: '🖼️', id: 'none' },
    { name: 'Foto', icon: '📷', id: 'photo' },
    { name: 'Anime', icon: '🌸', id: 'anime' },
    { name: 'Cartoon', icon: '🤡', id: 'cartoon' },
    { name: 'Pintura', icon: '🎨', id: 'painting' },
    { name: 'Pixar 3D', icon: '🧸', id: 'pixar' },
];

const LeftPanel: React.FC<LeftPanelProps> = ({
    mode, setMode, prompt, setPrompt,
    activeCreateFunction, setActiveCreateFunction,
    activeEditFunction, setActiveEditFunction,
    aspectRatio, setAspectRatio,
    activeStyle, setActiveStyle,
    showComposeUploader, showPhotoRestorationUploader,
    backToEditFunctions,
    handleImageUpload, image1, image2,
    generate, isLoading, error, onHistoryToggle,
    videoResolution, setVideoResolution,
    hasApiKey, onSelectApiKey
}) => {
    const [actionInProgress, setActionInProgress] = useState<'restore' | 'coloring' | null>(null);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    const handleTranslate = async () => {
        if (!prompt.trim() || isTranslating) return;
        setIsTranslating(true);
        try {
            const translatedPrompt = await translateText(prompt);
            setPrompt(translatedPrompt);
        } catch (error) {
            console.error("Failed to translate prompt:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleRestorationClick = async (action: 'restore' | 'coloring') => {
        if (isLoading || !image1) return;
        setActionInProgress(action);
        try {
            await generate(action);
        } catch (err) {
            console.error(err);
        } finally {
            setActionInProgress(null);
        }
    };
    
    const isGenerateButtonDisabled = isLoading || (mode === 'video' && !hasApiKey);

    return (
        <div className="left-panel w-full lg:w-1/3 xl:w-1/4 bg-gray-800 p-6 flex flex-col space-y-6 overflow-y-auto">
            <header>
                <div className="flex justify-between items-center">
                    <h1 className="panel-title text-3xl font-bold text-white">🎨 AI Image Studio</h1>
                    <button 
                        onClick={onHistoryToggle} 
                        title="Ver Histórico"
                        className="text-2xl p-2 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label="Ver histórico de gerações"
                    >
                        📜
                    </button>
                </div>
                <p className="panel-subtitle text-md text-gray-400">Gerador profissional de imagens e vídeos</p>
            </header>
            
            {!(mode === 'edit' && (showPhotoRestorationUploader || activeEditFunction === 'background-removal')) && (
                <div className="prompt-section">
                    <div className="section-title text-lg font-semibold mb-2 text-gray-300">
                         {mode === 'video' ? '🎬 Descreva seu vídeo' : '💭 Descreva sua ideia'}
                    </div>
                    <div className="relative">
                        <textarea
                            id="prompt"
                            className="prompt-input w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-3 pr-24 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder={mode === 'video' ? "Um astronauta surfando em uma onda cósmica..." : "Descreva a imagem que você deseja criar..."}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        ></textarea>
                         <button
                            onClick={handleTranslate}
                            disabled={isTranslating || !prompt.trim()}
                            className="absolute bottom-2.5 right-2.5 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            title="Traduzir para Inglês"
                        >
                            {isTranslating ? (
                                <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            ) : (
                                '🇬🇧'
                            )}
                            <span>Traduzir</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="mode-toggle grid grid-cols-3 bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setMode('create')}
                    className={`w-full p-2 rounded-md transition-colors text-sm font-medium ${mode === 'create' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}>
                    Criar
                </button>
                <button
                    onClick={() => setMode('edit')}
                    className={`w-full p-2 rounded-md transition-colors text-sm font-medium ${mode === 'edit' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}>
                    Editar
                </button>
                <button
                    onClick={() => setMode('video')}
                    className={`w-full p-2 rounded-md transition-colors text-sm font-medium ${mode === 'video' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}>
                    Vídeo
                </button>
            </div>

            <div className="dynamic-content flex-grow flex flex-col space-y-4">
                {mode === 'create' && (
                    <div className="flex flex-col space-y-4">
                        <div id="createFunctions" className="functions-section">
                            <div className="functions-grid grid grid-cols-2 gap-3">
                                {createFunctions.map(f => (
                                    <FunctionCard
                                        key={f.id}
                                        icon={f.icon}
                                        name={f.name}
                                        isActive={activeCreateFunction === f.id}
                                        onClick={() => setActiveCreateFunction(f.id)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="functions-section">
                            <div className="section-title text-sm font-semibold mb-2 text-gray-300">PROPORÇÃO</div>
                            <div className="grid grid-cols-5 gap-2">
                                {aspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        onClick={() => setAspectRatio(ratio.value)}
                                        className={`p-2 rounded-md text-xs font-medium transition-colors ${
                                            aspectRatio === ratio.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div id="imageStyleSection" className="functions-section">
                            <div className="section-title text-sm font-semibold mb-2 text-gray-300">ESTILO DA IMAGEM</div>
                            <div className="grid grid-cols-3 gap-3">
                                {imageStyles.map(style => (
                                    <FunctionCard
                                        key={style.id}
                                        icon={style.icon}
                                        name={style.name}
                                        isActive={activeStyle === style.id}
                                        onClick={() => setActiveStyle(style.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'edit' && !showComposeUploader && !showPhotoRestorationUploader && (
                     <div id="editFunctions" className="functions-section">
                        <div className="functions-grid grid grid-cols-2 gap-3">
                            {editFunctions.map(f => (
                                <FunctionCard
                                    key={f.id}
                                    icon={f.icon}
                                    name={f.name}
                                    isActive={activeEditFunction === f.id}
                                    onClick={() => setActiveEditFunction(f.id)}
                                />
                            ))}
                        </div>
                        <div className="mt-4">
                           <UploadArea 
                                id="imageUpload" 
                                previewId="imagePreview" 
                                onImageUpload={(file) => handleImageUpload(file, 1)} 
                                imagePreviewUrl={image1?.base64 || null}
                                label="Clique ou arraste uma imagem"
                                subtext="PNG, JPG, WebP (máx. 10MB)"
                            />
                        </div>
                        {activeEditFunction !== 'background-removal' && (
                             <div className="mt-4">
                                <div className="functions-section">
                                    <div className="section-title text-sm font-semibold mb-2 text-gray-300">PROPORÇÃO</div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {aspectRatios.map(ratio => (
                                            <button
                                                key={ratio.value}
                                                onClick={() => setAspectRatio(ratio.value)}
                                                className={`p-2 rounded-md text-xs font-medium transition-colors ${
                                                    aspectRatio === ratio.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            >
                                                {ratio.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'edit' && showComposeUploader && (
                    <div id="twoImagesSection" className="functions-section flex flex-col space-y-4">
                        <div className="section-title text-lg font-semibold text-gray-300">📸 Duas Imagens Necessárias</div>
                        <UploadArea
                            id="imageUpload1"
                            previewId="imagePreview1"
                            onImageUpload={(file) => handleImageUpload(file, 1)}
                            imagePreviewUrl={image1?.base64 || null}
                            label="Primeira Imagem"
                            subtext="Clique para selecionar"
                            isDual={true}
                         />
                         <UploadArea
                            id="imageUpload2"
                            previewId="imagePreview2"
                            onImageUpload={(file) => handleImageUpload(file, 2)}
                            imagePreviewUrl={image2?.base64 || null}
                            label="Segunda Imagem"
                            subtext="Clique para selecionar"
                            isDual={true}
                         />
                        <button onClick={backToEditFunctions} className="back-btn text-sm text-blue-400 hover:text-blue-300 self-start">
                            ← Voltar para Edição
                        </button>
                    </div>
                )}

                 {mode === 'edit' && showPhotoRestorationUploader && (
                    <div id="photoRestorationSection" className="functions-section flex flex-col space-y-4">
                        <div className="section-title text-lg font-semibold text-gray-300">🪄 Restauração de Foto</div>
                        <UploadArea
                            id="imageUploadRestoration"
                            previewId="imagePreviewRestoration"
                            onImageUpload={(file) => handleImageUpload(file, 1)}
                            imagePreviewUrl={image1?.base64 || null}
                            label="Imagem para Restaurar"
                            subtext="PNG, JPG, WebP (máx. 10MB)"
                        />
                        <div>
                            <label htmlFor="photoRestorationPrompt" className="block text-sm font-semibold mb-2 text-gray-300">Instruções Específicas (Opcional)</label>
                            <textarea
                                id="photoRestorationPrompt"
                                className="prompt-input w-full h-20 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Ex: 'remova o rasgo', 'faça o vestido azul'..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-3 pt-2">
                             <button
                                onClick={() => handleRestorationClick('restore')}
                                disabled={isLoading || !image1}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && actionInProgress === 'restore' ? (
                                    <>
                                        <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                        Restaurando...
                                    </>
                                ) : (
                                    'Restaurar Foto'
                                )}
                            </button>
                            <button
                                onClick={() => handleRestorationClick('coloring')}
                                disabled={isLoading || !image1}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && actionInProgress === 'coloring' ? (
                                    <>
                                        <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                        Colorindo...
                                    </>
                                ) : (
                                    'Colorir Foto'
                                )}
                            </button>
                        </div>
                        <button onClick={backToEditFunctions} className="back-btn text-sm text-blue-400 hover:text-blue-300 self-start">
                            ← Voltar para Edição
                        </button>
                    </div>
                )}
                 {mode === 'video' && (
                    <div className="flex flex-col space-y-4">
                        <div className="functions-section">
                            <div className="section-title text-sm font-semibold mb-2 text-gray-300">IMAGEM INICIAL (OPCIONAL)</div>
                            <UploadArea
                                id="videoStartImage"
                                previewId="videoStartImagePreview"
                                onImageUpload={(file) => handleImageUpload(file, 1)}
                                imagePreviewUrl={image1?.base64 || null}
                                label="Selecione uma imagem"
                                subtext="PNG, JPG, WebP"
                                isDual={true}
                            />
                        </div>
                         <div className="functions-section">
                            <div className="section-title text-sm font-semibold mb-2 text-gray-300">RESOLUÇÃO</div>
                            <div className="grid grid-cols-2 gap-2">
                                {videoResolutions.map(res => (
                                    <button
                                        key={res.value}
                                        onClick={() => setVideoResolution(res.value)}
                                        className={`p-2 rounded-md text-xs font-medium transition-colors ${
                                            videoResolution === res.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        {res.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="functions-section">
                            <div className="section-title text-sm font-semibold mb-2 text-gray-300">PROPORÇÃO</div>
                            <div className="grid grid-cols-2 gap-2">
                                {videoAspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        onClick={() => setAspectRatio(ratio.value)}
                                        className={`p-2 rounded-md text-xs font-medium transition-colors ${
                                            aspectRatio === ratio.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4">
                 {!hasApiKey && (
                    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 text-sm rounded-lg p-3 mb-4 text-center">
                        <p className="font-semibold mb-2 text-base">⚠️ Requer Chave de API</p>
                        <p className="mb-3 text-xs">Sua chave atual pode estar bloqueada ou ausente. Selecione uma chave válida do seu projeto para continuar.</p>
                        <button
                            onClick={onSelectApiKey}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                           🔑 Selecionar Chave de API
                        </button>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-300 hover:underline mt-2 inline-block">
                           Informações de faturamento
                        </a>
                    </div>
                )}
                {error && <p className="text-red-400 text-sm mb-2 p-2 bg-red-900/20 rounded border border-red-800/50">{error}</p>}
                {!(mode === 'edit' && showPhotoRestorationUploader) && (
                    <button
                        id="generateBtn"
                        onClick={() => generate()}
                        disabled={isGenerateButtonDisabled}
                        className="generate-btn w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                {mode === 'video' ? 'Gerando Vídeo...' : 'Processando...'}
                            </>
                        ) : (
                            <span className="btn-text">
                                {mode === 'video' ? '🎬 Gerar Vídeo' : (mode === 'edit' && activeEditFunction === 'background-removal' 
                                 ? '✂️ Remover Fundo' 
                                 : '🚀 Gerar Imagem')}
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
