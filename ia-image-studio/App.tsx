
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Mode, CreateFunction, EditFunction, ImageFile, AspectRatio, ImageStyle, HistoryItem, ImageFilter, VideoResolution } from './types';
import { generateImage, editImage, fileToBase64, upscaleImage, generateVideo } from './services/geminiService';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import MobileModal from './components/MobileModal';
import HistoryPanel from './components/HistoryPanel';

interface GenerationConfig {
    prompt: string;
    createFunction: CreateFunction;
    aspectRatio: AspectRatio;
    style: ImageStyle;
}

const videoLoadingMessages = [
    "Preparando a cena...",
    "Renderizando os frames...",
    "Adicionando efeitos especiais...",
    "Polindo os detalhes finais...",
    "Sua obra-prima em vídeo está quase pronta...",
];

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('create');
    const [prompt, setPrompt] = useState<string>('');
    const [activeCreateFunction, setActiveCreateFunction] = useState<CreateFunction>('free');
    const [activeEditFunction, setActiveEditFunction] = useState<EditFunction>('add-remove');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [activeStyle, setActiveStyle] = useState<ImageStyle>('none');
    
    const [image1, setImage1] = useState<ImageFile | null>(null);
    const [image2, setImage2] = useState<ImageFile | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Gerando sua imagem...');
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [lastGenerationConfig, setLastGenerationConfig] = useState<GenerationConfig | null>(null);

    const [showComposeUploader, setShowComposeUploader] = useState<boolean>(false);
    const [showPhotoRestorationUploader, setShowPhotoRestorationUploader] = useState<boolean>(false);
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
    
    const [activeFilter, setActiveFilter] = useState<ImageFilter>('none');

    // Video state
    const [videoResolution, setVideoResolution] = useState<VideoResolution>('720p');
    const [hasApiKey, setHasApiKey] = useState(false);
    const loadingIntervalRef = useRef<number | null>(null);

    const checkApiKey = async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            try {
                const keyStatus = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keyStatus);
            } catch (e) {
                setHasApiKey(false);
            }
        }
    };

    useEffect(() => {
        checkApiKey();
    }, []);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('generationHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
            setHistory([]);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const toggleHistoryPanel = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };
    
    const handleUseHistorySettings = (item: HistoryItem) => {
        setMode('create');
        setPrompt(item.prompt);
        setActiveCreateFunction(item.createFunction);
        setAspectRatio(item.aspectRatio);
        setActiveStyle(item.style);
        setImage1(null);
        setImage2(null);
        setGeneratedImages(null);
        setGeneratedVideoUrl(null);
        setLastGenerationConfig(null);
        setIsHistoryOpen(false);
    };
    
    const handleDeleteHistoryItem = (id: string) => {
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.filter(item => item.id !== id);
            localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    };
    
    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('generationHistory');
    };

    const handleImageUpload = async (file: File, imageIndex: 1 | 2) => {
        if (!file) return;
        try {
            const base64 = await fileToBase64(file);
            const imageFile = { file, base64: `data:${file.type};base64,${base64}` };
            if (imageIndex === 1) setImage1(imageFile);
            if (imageIndex === 2) setImage2(imageFile);
        } catch (err) {
            setError('Falha ao ler o arquivo de imagem.');
        }
    };

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        setGeneratedImages(null);
        setGeneratedVideoUrl(null);
        setLastGenerationConfig(null);
        setImage1(null);
        setImage2(null);
        setError(null);
        setShowComposeUploader(false);
        setShowPhotoRestorationUploader(false);
        if (newMode === 'video') {
            setAspectRatio('16:9');
        } else {
            setAspectRatio('1:1');
        }
        checkApiKey();
    };

    const handleEditFunctionSelect = (func: EditFunction) => {
        setActiveEditFunction(func);
        if (func === 'compose') {
            setShowComposeUploader(true);
            setShowPhotoRestorationUploader(false);
        } else if (func === 'photo-restoration') {
            setShowPhotoRestorationUploader(true);
            setShowComposeUploader(false);
        } else {
            setShowComposeUploader(false);
            setShowPhotoRestorationUploader(false);
        }
    };

    const backToEditFunctions = () => {
        setShowComposeUploader(false);
        setShowPhotoRestorationUploader(false);
    };

    const startLoadingMessages = (messages: string[]) => {
        let index = 0;
        setLoadingMessage(messages[index]);
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = window.setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]);
        }, 3000);
    };

    const stopLoadingMessages = () => {
        if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
        }
    };
    
    const generate = async (restorationAction?: 'restore' | 'coloring') => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setGeneratedVideoUrl(null);
        setActiveFilter('none');
        
        if (mode === 'video') {
            startLoadingMessages(videoLoadingMessages);
        } else {
            setLoadingMessage(mode === 'edit' && activeEditFunction === 'background-removal' ? 'Removendo fundo...' : 'Gerando sua imagem...');
        }


        try {
            if (mode === 'create') {
                if (!prompt) throw new Error("Por favor, insira uma descrição.");
                const currentConfig = { prompt, createFunction: activeCreateFunction, aspectRatio, style: activeStyle };
                const results = await generateImage(prompt, activeCreateFunction, aspectRatio, activeStyle, 1);
                setGeneratedImages(results);
                if (results && results.length > 0) {
                    setLastGenerationConfig(currentConfig);
                     const newHistoryItem: HistoryItem = {
                        id: `hist-${Date.now()}`,
                        timestamp: Date.now(),
                        imageUrl: results[0],
                        prompt: currentConfig.prompt,
                        createFunction: currentConfig.createFunction,
                        aspectRatio: currentConfig.aspectRatio,
                        style: currentConfig.style,
                    };
                    setHistory(prevHistory => {
                        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50);
                        localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
                        return updatedHistory;
                    });
                    if (isMobile) {
                        setIsModalOpen(true);
                    }
                }
            } else if (mode === 'edit') {
                let result: string | null = null;
                if (activeEditFunction === 'compose') {
                    if (!image1 || !image2 || !prompt) throw new Error("Por favor, forneça duas imagens e uma descrição.");
                    result = await editImage(prompt, [image1, image2]);
                } else if (activeEditFunction === 'photo-restoration') {
                    if (!image1) throw new Error("Por favor, forneça uma imagem.");
                    const basePrompt = restorationAction === 'restore' ? 'Restore this old photo, fix damage.' : 'Colorize this photo.';
                    result = await editImage(prompt ? `${prompt}. ${basePrompt}` : basePrompt, [image1]);
                } else if (activeEditFunction === 'background-removal') {
                    if (!image1) throw new Error("Por favor, forneça uma imagem.");
                    result = await editImage("Remove background.", [image1]);
                } else {
                    if (!image1 || !prompt) throw new Error("Por favor, forneça uma imagem e uma descrição.");
                    result = await editImage(prompt, [image1], aspectRatio);
                }
                setGeneratedImages(result ? [result] : null);
                if (result && isMobile) setIsModalOpen(true);
            } else if (mode === 'video') {
                if (!prompt && !image1) throw new Error("Por favor, forneça uma descrição ou imagem.");
                const videoUrl = await generateVideo(prompt, image1, videoResolution, aspectRatio as '16:9' | '9:16');
                setGeneratedVideoUrl(videoUrl);
                if (videoUrl && isMobile) setIsModalOpen(true);
            }
        } catch (err: any) {
             const errMsg = err.message || "";
             if (
                 errMsg.includes("Requested entity was not found") || 
                 errMsg.includes("PERMISSION_DENIED") || 
                 errMsg.includes("Referrer") ||
                 errMsg.includes("restrições de domínio")
             ) {
                setError("Chave de API inválida ou bloqueada (HTTP Referrer). Por favor, use o botão 'Selecionar Chave' para usar uma chave sem restrições.");
                setHasApiKey(false);
            } else {
                setError(err.message || 'Erro inesperado.');
            }
            if (isMobile) setIsModalOpen(true); // Abre o modal no mobile para mostrar o erro se necessário
        } finally {
            setIsLoading(false);
            stopLoadingMessages();
        }
    };

    const generateVariations = async () => {
        if (!lastGenerationConfig || isLoading) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        setLoadingMessage('Gerando variações...');
        try {
            const results = await generateImage(lastGenerationConfig.prompt, lastGenerationConfig.createFunction, lastGenerationConfig.aspectRatio, lastGenerationConfig.style, 4);
            setGeneratedImages(results);
            if(results && results.length > 0 && isMobile) setIsModalOpen(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const editCurrentImage = async () => {
        if (!generatedImages || generatedImages.length === 0) return;
        try {
            const imageUrl = generatedImages[0];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "edit.png", { type: blob.type });
            setMode('edit');
            setImage1({ file, base64: imageUrl });
            setImage2(null);
            setGeneratedImages(null);
            setGeneratedVideoUrl(null);
            setError(null);
            if (isMobile) setIsModalOpen(false);
        } catch (err) {
            setError("Erro ao carregar imagem para edição.");
        }
    };

    const handleUpscale = async () => {
        if (!generatedImages || generatedImages.length === 0 || isLoading) return;
        setIsLoading(true);
        setError(null);
        setLoadingMessage('Melhorando resolução...');
        try {
            const imageUrl = generatedImages[0];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "upscale.png", { type: blob.type });
            const result = await upscaleImage({ file, base64: imageUrl });
            setGeneratedImages([result]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto min-h-screen lg:p-4">
            <div className="flex flex-col lg:flex-row bg-gray-900 text-gray-200 min-h-screen lg:min-h-0 lg:max-h-[95vh] lg:rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <LeftPanel
                    mode={mode}
                    setMode={handleModeChange}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    activeCreateFunction={activeCreateFunction}
                    setActiveCreateFunction={setActiveCreateFunction}
                    activeEditFunction={activeEditFunction}
                    setActiveEditFunction={handleEditFunctionSelect}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    activeStyle={activeStyle}
                    setActiveStyle={setActiveStyle}
                    showComposeUploader={showComposeUploader}
                    showPhotoRestorationUploader={showPhotoRestorationUploader}
                    backToEditFunctions={backToEditFunctions}
                    handleImageUpload={handleImageUpload}
                    image1={image1}
                    image2={image2}
                    generate={generate}
                    isLoading={isLoading}
                    error={error}
                    onHistoryToggle={toggleHistoryPanel}
                    videoResolution={videoResolution}
                    setVideoResolution={setVideoResolution}
                    hasApiKey={hasApiKey}
                    onSelectApiKey={async () => {
                        await window.aistudio.openSelectKey();
                        setHasApiKey(true);
                        setTimeout(checkApiKey, 500); 
                    }}
                />
                {!isMobile && (
                    <RightPanel
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        generatedImages={generatedImages}
                        generatedVideoUrl={generatedVideoUrl}
                        editCurrentImage={editCurrentImage}
                        generateVariations={generateVariations}
                        handleUpscale={handleUpscale}
                        canGenerateVariations={lastGenerationConfig !== null}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        error={error}
                    />
                )}
            </div>
             <HistoryPanel
                isOpen={isHistoryOpen}
                onClose={toggleHistoryPanel}
                history={history}
                onUseSettings={handleUseHistorySettings}
                onDelete={handleDeleteHistoryItem}
                onClearAll={handleClearHistory}
            />
            {isMobile && isModalOpen && (
                 <MobileModal
                    imageSrcs={generatedImages}
                    videoSrc={generatedVideoUrl}
                    onEdit={editCurrentImage}
                    onNewContent={() => {
                        setIsModalOpen(false);
                        setGeneratedImages(null);
                        setGeneratedVideoUrl(null);
                        setImage1(null);
                        setImage2(null);
                        setError(null);
                    }}
                    generateVariations={generateVariations}
                    onUpscale={handleUpscale}
                    canGenerateVariations={lastGenerationConfig !== null}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    error={error}
                />
            )}
        </div>
    );
};

export default App;
