import React, { useState, useCallback, useEffect } from 'react';
import ImageDropzone from './components/ImageDropzone';
import { AppStatus } from './types';
import { generateStyleSuggestions, generateFinalImage, upscaleImage, generateNewPose } from './services/geminiService';

// --- Helper & UI Components (defined inside App.tsx to reduce file count) ---

const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6 mb-8">
    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
      Provador Virtual IA
    </h1>
    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
      Experimente roupas virtualmente com caimento realista e preservação total de detalhes.
    </p>
  </header>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ClothingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ProgressBar: React.FC<{ status: AppStatus }> = ({ status }) => {
  const isLoading = status === AppStatus.GENERATING || status === AppStatus.SUGGESTING || status === AppStatus.UPSCALING;
  return (
    <div className={`relative w-full bg-slate-700 rounded-full h-2.5 overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2.5 rounded-full w-full absolute top-0 left-0 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
    </div>
  );
};

const AspectRatioSelector: React.FC<{
  selected: string;
  onChange: (value: string) => void;
  disabled: boolean;
}> = ({ selected, onChange, disabled }) => {
  const ratios = [
    { value: '1:1', label: 'Quadrado', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg> },
    { value: '3:4', label: 'Retrato', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.5 3h15v18h-15z"/></svg> },
    { value: '4:3', label: 'Paisagem', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 4.5h18v15H3z"/></svg> },
    { value: '9:16', label: 'Story', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.75 3h10.5v18h-10.5z"/></svg> },
    { value: '16:9', label: 'Widescreen', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6.75h18v10.5H3z"/></svg> },
  ];

  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-sm uppercase tracking-wider text-slate-400">
        Proporção
      </label>
      <div className="flex flex-wrap gap-3">
        {ratios.map(ratio => (
          <button
            key={ratio.value}
            type="button"
            onClick={() => onChange(ratio.value)}
            disabled={disabled}
            aria-label={`Selecionar proporção ${ratio.label} ${ratio.value}`}
            className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all duration-200 w-20 h-20 md:w-24 md:h-24 ${
              selected === ratio.value
                ? 'border-indigo-500 bg-indigo-900/50 text-indigo-300 shadow-md shadow-indigo-500/20'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 fill-current">{ratio.icon}</div>
            <span className="text-xs md:text-sm font-medium">{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const StepLabel: React.FC<{ number: string; title: string }> = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
            {number}
        </span>
        <h2 className="text-xl font-semibold text-slate-200">{title}</h2>
    </div>
);

// Interface for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// --- Main App Component ---

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [stylePrompt, setStylePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedAspectRatio, setGeneratedAspectRatio] = useState<string>('1:1');
  const [isUpscaled, setIsUpscaled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const isLoading = status === AppStatus.GENERATING || status === AppStatus.SUGGESTING || status === AppStatus.UPSCALING;

  // Effect to handle Escape key for closing fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSuggest = useCallback(async () => {
    if (!modelImage || !clothingImage) {
      setStatus(AppStatus.ERROR);
      setStatusMessage('Por favor, envie a imagem do modelo e da roupa primeiro.');
      return;
    }
    setStatus(AppStatus.SUGGESTING);
    setStatusMessage('Gerando sugestões de estilo com IA...');
    try {
      const suggestions = await generateStyleSuggestions(modelImage, clothingImage);
      setStylePrompt(suggestions);
      setStatus(AppStatus.IDLE);
      setStatusMessage('');
    } catch (error) {
      const err = error as Error;
      setStatus(AppStatus.ERROR);
      setStatusMessage(err.message);
    }
  }, [modelImage, clothingImage]);

  const handleGenerate = useCallback(async () => {
    if (!modelImage || !clothingImage) {
      setStatus(AppStatus.ERROR);
      setStatusMessage('Por favor, envie a imagem do modelo e da roupa primeiro.');
      return;
    }
    setStatus(AppStatus.GENERATING);
    setStatusMessage('Ajustando caimento e preservando texturas...');
    try {
      const imageB64 = await generateFinalImage(modelImage, clothingImage, stylePrompt, aspectRatio);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
      setGeneratedAspectRatio(aspectRatio);
      setStatus(AppStatus.SUCCESS);
      setStatusMessage('Prova virtual finalizada com sucesso!');
      setIsUpscaled(false); // Reset for new image
    } catch (error) {
      const err = error as Error;
      setStatus(AppStatus.ERROR);
      setStatusMessage(err.message);
    }
  }, [modelImage, clothingImage, stylePrompt, aspectRatio]);

  const handleUpscale = useCallback(async () => {
    if (!generatedImage) {
        setStatus(AppStatus.ERROR);
        setStatusMessage('Não há imagem gerada para melhorar.');
        return;
    }
    setStatus(AppStatus.UPSCALING);
    setStatusMessage('Melhorando nitidez e realismo... Aguarde.');
    try {
        const imageB64 = await upscaleImage(generatedImage);
        setGeneratedImage(`data:image/png;base64,${imageB64}`);
        setStatus(AppStatus.SUCCESS);
        setStatusMessage('A qualidade foi otimizada!');
        setIsUpscaled(true);
    } catch (error) {
        const err = error as Error;
        setStatus(AppStatus.ERROR);
        setStatusMessage(err.message);
    }
  }, [generatedImage]);

  const handleNewPose = useCallback(async () => {
    if (!generatedImage) {
        setStatus(AppStatus.ERROR);
        setStatusMessage('Não há imagem gerada para criar uma nova pose.');
        return;
    }
    setStatus(AppStatus.GENERATING); // Re-use generating state
    setStatusMessage('Calculando nova pose mantendo o look...');
    try {
        const imageB64 = await generateNewPose(generatedImage, generatedAspectRatio);
        setGeneratedImage(`data:image/png;base64,${imageB64}`);
        setStatus(AppStatus.SUCCESS);
        setStatusMessage('Nova pose gerada com o mesmo look!');
        setIsUpscaled(false); // Reset upscale status for the new image
    } catch (error) {
        const err = error as Error;
        setStatus(AppStatus.ERROR);
        setStatusMessage(err.message);
    }
  }, [generatedImage, generatedAspectRatio]);

  const handleReset = useCallback(() => {
    setModelImage(null);
    setClothingImage(null);
    setStylePrompt('');
    setAspectRatio('1:1');
    setStatus(AppStatus.IDLE);
    setStatusMessage('');
    setGeneratedImage(null);
    setIsUpscaled(false);
    setGeneratedAspectRatio('1:1');
  }, []);
  
  const handleEdit = useCallback(() => {
    setGeneratedImage(null);
    setStatus(AppStatus.IDLE);
    setStatusMessage('');
    setIsUpscaled(false);
  }, []);

  const toggleSpeechRecognition = useCallback(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus(AppStatus.ERROR);
      setStatusMessage("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setStatusMessage("Ouvindo...");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setStylePrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
      setStatusMessage("");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setStatusMessage("Erro no reconhecimento de voz.");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (statusMessage === "Ouvindo...") setStatusMessage("");
    };

    recognition.start();

  }, [isListening, statusMessage]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-slate-900">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        
        {generatedImage ? (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 mt-4 animate-fade-in">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-semibold text-center text-slate-300">Seu Look Virtual</h2>
                    <p className="text-sm text-slate-500 italic">Dica: Se o caimento não estiver perfeito, tente usar uma foto com pose frontal.</p>
                </div>
                
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 bg-slate-800 group">
                    <img src={generatedImage} alt="Imagem gerada" className="w-full h-auto object-contain max-h-[70vh]" />
                    <button 
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                        title="Expandir em tela cheia"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl border border-slate-700 transition-all hover:border-indigo-500/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium">Recriar</span>
                    </button>

                    <button 
                        onClick={handleUpscale}
                        disabled={isLoading || isUpscaled}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group ${
                            isUpscaled 
                            ? 'bg-purple-900/30 border-purple-500/50 text-purple-300' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-purple-500/50'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isUpscaled ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="font-medium">{isUpscaled ? 'Alta Definição' : 'HD Upscale'}</span>
                    </button>

                    <button 
                        onClick={handleNewPose}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl border border-slate-700 transition-all hover:border-teal-500/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 group-hover:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Nova Pose</span>
                    </button>

                    <button 
                        onClick={() => setIsFullscreen(true)}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl border border-slate-700 transition-all hover:border-slate-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-medium">Tela Cheia</span>
                    </button>

                    <a 
                        href={generatedImage} 
                        download="look_virtual.png"
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl border border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="font-medium">Baixar</span>
                    </a>

                    <button 
                        onClick={handleEdit}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl border border-slate-700 transition-all hover:border-cyan-500/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        <span className="font-medium">Voltar</span>
                    </button>

                    <button 
                        onClick={handleReset}
                        disabled={isLoading}
                        className="col-span-2 md:col-span-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-red-300 py-3 px-4 rounded-xl border border-slate-700 transition-all hover:border-red-500/50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 group-hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-medium">Limpar Tudo</span>
                    </button>
                </div>

                 <div className="h-8 flex flex-col items-center justify-center gap-2 mt-4">
                    {statusMessage && (
                    <p className={`text-center transition-opacity duration-300 ${
                        status === AppStatus.ERROR ? 'text-red-400' : 'text-slate-400'
                    }`}>
                        {statusMessage}
                    </p>
                    )}
                </div>
                <ProgressBar status={status} />
            </div>
        ) : (
          <main className="flex flex-col gap-10">
            
            <section>
                <StepLabel number="1" title="Suas Fotos" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageDropzone id="model" title="Foto do Modelo (Você)" icon={<UserIcon />} onFileSelect={setModelImage} selectedFile={modelImage} />
                    <ImageDropzone id="clothing" title="Peça de Roupa" icon={<ClothingIcon />} onFileSelect={setClothingImage} selectedFile={clothingImage} />
                </div>
                <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-indigo-200/80">
                        <strong>Dica para melhor caimento:</strong> Use fotos frontais e com o corpo visível. Evite roupas muito volumosas ou poses complexas na foto do modelo para garantir que a IA consiga mapear o corpo corretamente.
                    </p>
                </div>
            </section>

            <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <StepLabel number="2" title="Ajustes Finos" />
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label htmlFor="style" className="font-semibold text-sm uppercase tracking-wider text-slate-400">
                                Instruções Extras (IA)
                            </label>
                            <button 
                                onClick={handleSuggest} 
                                disabled={isLoading || !modelImage || !clothingImage}
                                className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 hover:underline"
                            >
                                Sugerir Ajustes
                            </button>
                        </div>
                        <div className="relative">
                            <textarea
                                id="style"
                                value={stylePrompt}
                                onChange={(e) => setStylePrompt(e.target.value)}
                                placeholder="Ex: Ajustar sombras, iluminação de estúdio, manter estilo casual..."
                                rows={4}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 resize-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={toggleSpeechRecognition}
                                disabled={isLoading}
                                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                                    isListening 
                                    ? 'bg-red-500/20 text-red-500 animate-pulse' 
                                    : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/30'
                                }`}
                                title="Falar instruções"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="md:w-auto">
                        <AspectRatioSelector 
                            selected={aspectRatio}
                            onChange={setAspectRatio}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </section>

            <section className="flex flex-col items-center justify-center pt-4">
               <button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !modelImage || !clothingImage}
                    className="w-full md:w-2/3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processando Look...
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Experimentar Roupa Agora
                        </>
                    )}
                </button>
                
                <div className="w-full md:w-2/3 h-16 flex flex-col items-center justify-center gap-2 mt-6">
                    <ProgressBar status={status} />
                    {statusMessage && (
                    <p className={`text-center font-medium transition-opacity duration-300 ${
                        status === AppStatus.ERROR ? 'text-red-400' : 'text-indigo-200'
                    }`}>
                        {statusMessage}
                    </p>
                    )}
                </div>
            </section>
          </main>
        )}
      </div>

      {isFullscreen && generatedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <img 
            src={generatedImage} 
            alt="Imagem gerada em tela cheia" 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} 
          />
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            aria-label="Fechar tela cheia"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;