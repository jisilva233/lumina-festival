import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ImageDropzoneProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ id, title, icon, onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [timerDuration, setTimerDuration] = useState<0 | 3 | 10>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle preview generation
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Effect to attach stream to video element when camera opens
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn("Video play interrupted:", e));
    }
  }, [isCameraOpen]);

  const handleFile = useCallback((file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (!isCameraOpen) {
      inputRef.current?.click();
    }
  }, [isCameraOpen]);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  // --- Camera Logic ---

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsCameraLoading(false);
    setCountdown(null);
  };

  const startCamera = async (e?: React.MouseEvent, preferredMode?: 'user' | 'environment') => {
    if (e) e.stopPropagation();
    setCameraError(null);
    setIsCameraLoading(true);
    
    // Explicitly stop any existing stream first
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const mode = preferredMode || facingMode;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode
        } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.warn(`Camera attempt with ${mode} failed, trying fallback...`, err);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setIsCameraOpen(true);
      } catch (finalErr: any) {
        console.error("Camera failed to start:", finalErr);
        setIsCameraLoading(false);
        
        let msg = "Erro desconhecido na câmera.";
        if (finalErr.name === 'NotAllowedError' || finalErr.name === 'PermissionDeniedError') {
          msg = "Acesso à câmera negado. Verifique as permissões.";
        } else if (finalErr.name === 'NotFoundError') {
          msg = "Nenhuma câmera encontrada.";
        } else if (finalErr.name === 'NotReadableError') {
          msg = "A câmera está em uso por outro app.";
        }
        
        setCameraError(msg);
      }
    }
  };

  const switchCamera = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newMode = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(newMode);
      startCamera(undefined, newMode);
  };

  const toggleTimer = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (timerDuration === 0) setTimerDuration(3);
      else if (timerDuration === 3) setTimerDuration(10);
      else setTimerDuration(0);
  };

  const performCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Mirror effect fix if using front camera
        if (facingMode === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const initiateCapture = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (timerDuration === 0) {
        performCapture();
    } else {
        setCountdown(timerDuration);
        let currentCount = timerDuration;
        
        const interval = setInterval(() => {
            currentCount -= 1;
            setCountdown(currentCount);
            
            if (currentCount <= 0) {
                clearInterval(interval);
                performCapture();
            }
        }, 1000);
    }
  };

  // --- Rendering ---
  
  const baseClasses = 'relative flex-1 min-h-[250px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ease-in-out group overflow-hidden';
  
  // If camera is open
  if (isCameraOpen) {
      return (
        <div className={`${baseClasses} border-slate-600 bg-black`}>
             <canvas ref={canvasRef} className="hidden" />
             
             {isCameraLoading && (
                 <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
             )}

             <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black w-full h-full">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    onLoadedMetadata={() => {
                        setIsCameraLoading(false);
                        videoRef.current?.play().catch(e => console.error("Play error:", e));
                    }}
                    className={`absolute inset-0 w-full h-full object-contain bg-black ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                
                {/* Countdown Overlay */}
                {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-pulse">
                        <span className="text-9xl font-bold text-white drop-shadow-lg">{countdown}</span>
                    </div>
                )}

                {/* Top Controls */}
                <div className="absolute top-4 right-4 z-40 flex gap-4 pointer-events-auto">
                     <button
                        onClick={switchCamera}
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
                        title="Alternar Câmera"
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                     </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-6 flex items-center gap-6 z-50 pointer-events-auto">
                    <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-red-500/80 hover:bg-red-600 text-white p-4 rounded-full backdrop-blur-sm transition-transform hover:scale-105 shadow-lg"
                        title="Cancelar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <button
                        type="button"
                        onClick={initiateCapture}
                        className="bg-white hover:bg-slate-100 text-indigo-600 p-5 rounded-full shadow-lg shadow-indigo-500/30 transform hover:scale-110 transition-transform border-4 border-indigo-500/30"
                        title="Tirar Foto"
                    >
                         {countdown !== null && countdown > 0 ? (
                             <span className="h-8 w-8 flex items-center justify-center font-bold text-xl">{countdown}</span>
                         ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                         )}
                    </button>

                    <button
                        type="button"
                        onClick={toggleTimer}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg flex flex-col items-center justify-center w-12 h-12 ${timerDuration > 0 ? 'bg-indigo-600 text-white' : 'bg-black/50 text-slate-300 hover:bg-black/70'}`}
                        title="Temporizador"
                    >
                        {timerDuration > 0 ? (
                            <span className="font-bold text-sm">{timerDuration}s</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // Normal Dropzone Mode
  const inactiveClasses = 'bg-slate-800/50 border-slate-600 hover:border-indigo-500 hover:bg-slate-800 cursor-pointer';
  const activeClasses = 'border-indigo-400 bg-indigo-900/50 scale-105 shadow-lg shadow-indigo-500/20 cursor-pointer';

  return (
    <div
      className={`${baseClasses} ${isDragging ? activeClasses : inactiveClasses}`}
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          setIsDragging(false); 
          handleFile(e.dataTransfer.files?.[0]); 
      }}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        id={id}
        name={id}
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      
      {preview ? (
        <>
            <img src={preview} alt={title} className="w-full h-full object-contain absolute inset-0 z-0"/>
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors duration-300 z-10"></div>
            <button 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 z-20 bg-red-600/80 hover:bg-red-500 text-white p-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="relative z-20 text-white text-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="font-semibold text-lg">{title}</p>
                <p className="text-sm">Clique ou arraste para trocar.</p>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-slate-400 z-10 w-full px-4">
          <div className="w-12 h-12 group-hover:text-indigo-400 transition-colors">{icon}</div>
          <div className="text-center group-hover:text-slate-300 transition-colors">
             <p className="font-semibold text-lg">{title}</p>
             <p className="text-sm">Arraste ou clique para enviar</p>
          </div>
          
          <div className="flex items-center w-full gap-2 my-1">
             <div className="h-px bg-slate-600 flex-1"></div>
             <span className="text-xs text-slate-500 uppercase">ou</span>
             <div className="h-px bg-slate-600 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={(e) => startCamera(e)}
            disabled={isCameraLoading}
            className={`flex items-center gap-2 bg-slate-700 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm transition-colors shadow-lg z-20 ${isCameraLoading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isCameraLoading ? (
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )}
            {isCameraLoading ? 'Iniciando...' : 'Usar Câmera'}
          </button>
          
          {cameraError && (
              <p className="text-red-400 text-xs mt-1 font-medium bg-red-900/20 px-2 py-1 rounded">{cameraError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;