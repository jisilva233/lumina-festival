
import React, { useRef, useState } from 'react';

interface UploadAreaProps {
    id: string;
    previewId: string;
    onImageUpload: (file: File) => void;
    imagePreviewUrl: string | null;
    label: string;
    subtext: string;
    isDual?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ id, previewId, onImageUpload, imagePreviewUrl, label, subtext, isDual = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

    const handleAreaClick = () => {
        setIsOptionModalOpen(true);
    };

    const handleFileSelect = (source: 'camera-back' | 'camera-front' | 'gallery') => {
        if (fileInputRef.current) {
            if (source === 'camera-back') {
                fileInputRef.current.setAttribute('capture', 'environment');
            } else if (source === 'camera-front') {
                fileInputRef.current.setAttribute('capture', 'user');
            } else {
                fileInputRef.current.removeAttribute('capture');
            }
            fileInputRef.current.click();
        }
        setIsOptionModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
        
        // Reset state after selection
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute('capture');
        }
        // To allow re-uploading the same file, we need to clear the value
        e.target.value = '';
    };

    return (
        <>
            <div
                onClick={handleAreaClick}
                className={`${isDual ? 'upload-area-dual' : 'upload-area'} relative w-full ${isDual ? 'h-32' : 'h-40'} bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors`}
            >
                {imagePreviewUrl ? (
                    <img id={previewId} src={imagePreviewUrl} alt="Preview" className="image-preview absolute w-full h-full object-cover rounded-lg" />
                ) : (
                    <>
                        <div className="text-4xl text-gray-400">📁</div>
                        <p className="font-semibold mt-2">{label}</p>
                        <p className="upload-text text-xs text-gray-400">{subtext}</p>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    id={id}
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                />
            </div>

            {isOptionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsOptionModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-80" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">Selecione a Origem</h3>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => handleFileSelect('camera-back')}
                                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                <span className="mr-2 text-xl">📸</span>
                                Câmera Traseira
                            </button>
                            <button
                                onClick={() => handleFileSelect('camera-front')}
                                className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                <span className="mr-2 text-xl">🤳</span>
                                Câmera Frontal (Selfie)
                            </button>
                            <button
                                onClick={() => handleFileSelect('gallery')}
                                className="flex items-center justify-center w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                               <span className="mr-2 text-xl">🖼️</span>
                                Escolher da Galeria
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsOptionModalOpen(false)}
                            className="mt-4 w-full text-gray-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadArea;
