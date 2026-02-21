
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import type { ImageFile, CreateFunction, AspectRatio, ImageStyle, VideoResolution } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set at build time. It will be expected from the user selection dialog.");
}

const getGenAIClient = () => {
    if (!process.env.API_KEY) {
         throw new Error("A chave de API não foi configurada. Por favor, selecione uma chave válida.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const translateText = async (text: string): Promise<string> => {
    if (!text || !text.trim()) {
        return text || '';
    }
    try {
        const ai = getGenAIClient();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: text,
            config: {
                systemInstruction: "You are an expert translator. Translate the following text to English. Only return the translated text, without any extra phrases.",
                thinkingConfig: { thinkingBudget: 0 } 
            },
        });
        return response.text?.trim() || text;
    } catch (error: any) {
        const errorMessage = error.message || "";
        console.error("Translation error details:", error);
        
        // Se for erro de permissão ou chave, bloqueia tudo
        if (
            errorMessage.includes("API_KEY_HTTP_REFERRER_BLOCKED") || 
            errorMessage.includes("PERMISSION_DENIED") ||
            errorMessage.includes("403")
        ) {
            throw new Error("Sua chave de API possui restrições de domínio (HTTP Referrer) e não pode ser usada aqui. Por favor, use o botão 'Selecionar Chave' para escolher uma chave sem restrições.");
        }
        
        // Para outros erros (timeout, quota), retorna o original para não travar a geração
        return text;
    }
};

const getAugmentedPrompt = (prompt: string, func: CreateFunction, style: ImageStyle): string => {
    let augmentedPrompt: string;
    switch (func) {
        case 'sticker':
            augmentedPrompt = `A die-cut sticker of ${prompt}, high quality, vector style, clean sticker, white background, professional sticker design.`;
            break;
        case 'text':
            augmentedPrompt = `A minimalist and professional logo design for "${prompt}", vector art, simple, clean lines, on a plain white background.`;
            break;
        case 'comic':
            augmentedPrompt = `${prompt}, in a vibrant American comic book art style, with bold outlines, dynamic action, and dot matrix shading.`;
            break;
        case 'free':
        default:
            augmentedPrompt = prompt;
            break;
    }

    switch (style) {
        case 'photo': augmentedPrompt += ', photorealistic, hyper-detailed, 8k, professional photography.'; break;
        case 'anime': augmentedPrompt += ', in the style of anime, vibrant colors, detailed line art, epic, masterpiece.'; break;
        case 'cartoon': augmentedPrompt += ', cartoon style, vibrant, playful, cel-shaded, 2d animation style.'; break;
        case 'painting': augmentedPrompt += ', impressionist painting, oil on canvas, visible brushstrokes, masterpiece, artistic.'; break;
        case 'pixar': augmentedPrompt += ', Pixar animation style, 3D render, vibrant colors, detailed characters, cinematic lighting.'; break;
        default: break;
    }
    return augmentedPrompt;
}

export const generateImage = async (prompt: string, func: CreateFunction, aspectRatio: AspectRatio, style: ImageStyle, numberOfImages: number = 1): Promise<string[]> => {
    const ai = getGenAIClient();
    
    // Tenta traduzir, mas não trava se falhar de forma não-crítica
    let translatedPrompt = prompt;
    try {
        translatedPrompt = await translateText(prompt);
    } catch (e: any) {
        // Se for erro de chave, relança. Se não, segue com original.
        if (e.message.includes("chave") || e.message.includes("API")) throw e;
    }
    
    const augmentedPrompt = getAugmentedPrompt(translatedPrompt, func, style);
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: augmentedPrompt,
        config: {
            numberOfImages: numberOfImages,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    } else {
        throw new Error("A API não retornou nenhuma imagem para esta descrição e estilo.");
    }
};

export const editImage = async (prompt: string, images: ImageFile[], aspectRatio?: AspectRatio): Promise<string> => {
    const ai = getGenAIClient();
    const imageParts = await Promise.all(images.map(async (img) => {
        const base64Data = await fileToBase64(img.file);
        return {
            inlineData: {
                data: base64Data,
                mimeType: img.file.type,
            },
        };
    }));
    
    const translatedPrompt = await translateText(prompt);

    let finalPrompt = translatedPrompt;
    if (aspectRatio) {
        const ratioMap: Record<string, string> = {
            '1:1': '1:1 (square)',
            '16:9': '16:9 (widescreen landscape)',
            '9:16': '9:16 (tall portrait)',
            '4:3': '4:3 (landscape)',
            '3:4': '3:4 (portrait)',
        };
        const ratioDescription = ratioMap[aspectRatio] || aspectRatio;
        
        finalPrompt = `SYSTEM INSTRUCTION: You are an expert image editor. Follow these steps precisely.
1.  **Set Canvas:** The final output image MUST have a canvas with an aspect ratio of exactly ${ratioDescription}.
2.  **Outpaint/Expand:** If the original image is smaller than this target canvas, you MUST intelligently expand the image.
3.  **Preserve Original:** Do NOT crop or distort the original image content.
4.  **Apply User Edit:** After the canvas is correctly resized, apply the user's edit request: "${translatedPrompt}"`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [...imageParts, { text: finalPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("A edição de imagem falhou. Tente outra descrição.");
};

export const upscaleImage = async (image: ImageFile): Promise<string> => {
    const ai = getGenAIClient();
    const imagePart = {
        inlineData: {
            data: await fileToBase64(image.file),
            mimeType: image.file.type,
        },
    };

    const prompt = "Upscale this image to 4k resolution, enhancing all details, sharpness, and quality.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, { text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("O upscale falhou. A imagem pode ser muito grande ou incompatível.");
};

export const generateVideo = async (
    prompt: string, 
    image: ImageFile | null, 
    resolution: VideoResolution,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    const ai = getGenAIClient();
    
    let translatedPrompt = prompt;
    try {
        translatedPrompt = await translateText(prompt);
    } catch (e) {
        // Ignora erro de tradução não crítico
    }

    let imagePayload;
    if (image) {
        const base64Data = await fileToBase64(image.file);
        imagePayload = {
            imageBytes: base64Data,
            mimeType: image.file.type,
        };
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: translatedPrompt,
        ...(imagePayload && { image: imagePayload }),
        config: {
            numberOfVideos: 1,
            resolution: resolution,
            aspectRatio: aspectRatio,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch(e: any) {
            if (e.message && (e.message.includes("Requested entity was not found") || e.message.includes("403") || e.message.includes("PERMISSION_DENIED"))) {
                 throw new Error("Sua sessão de API expirou ou a chave é inválida. Por favor, selecione uma nova chave de API.");
            }
            throw e;
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Falha ao obter link do vídeo.");
    
    const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
    const videoResponse = await fetch(finalUrl);
    if (!videoResponse.ok) throw new Error(`Falha ao baixar vídeo: ${videoResponse.statusText}`);

    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};
