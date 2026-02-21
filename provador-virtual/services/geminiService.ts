import { GoogleGenAI } from "@google/genai";

// Helper to convert File to a Base64 string for the API
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to extract Base64 content from a data URL
const dataUrlToBase64 = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  throw new Error('Invalid data URL format.');
};

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Call Gemini API directly via REST for image generation
 */
const callGeminiImageAPI = async (parts: any[]): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  console.log("Calling Gemini REST API for image generation...");

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API error:", errorData);
    throw new Error(`API error (${response.status}): ${JSON.stringify(errorData.error?.message || errorData)}`);
  }

  const data = await response.json();
  console.log("API response received:", JSON.stringify(data, null, 2));

  if (data.candidates && data.candidates.length > 0) {
    const candidate = data.candidates[0];
    if (candidate.content && Array.isArray(candidate.content.parts)) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log("Image data extracted successfully!");
          return part.inlineData.data;
        }
      }
    }
  }

  throw new Error("Modelo não retornou imagem. Resposta: " + JSON.stringify(data));
};

/**
 * Generates creative style suggestions based on a model and clothing image.
 */
export const generateStyleSuggestions = async (
  modelImageFile: File,
  clothingImageFile: File
): Promise<string> => {
  try {
    const modelImageBase64 = await fileToBase64(modelImageFile);
    const clothingImageBase64 = await fileToBase64(clothingImageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: { parts: [
          { inlineData: { mimeType: modelImageFile.type, data: modelImageBase64 } },
          { inlineData: { mimeType: clothingImageFile.type, data: clothingImageBase64 } },
          { text: `Analise a pessoa na primeira imagem e a peça de roupa na segunda. Sugira 3 estilos de iluminação ou acabamento fotográfico que valorizariam o look. Formate de forma concisa.` },
        ]},
    });

    return response.text;
  } catch (error) {
    console.error("Error generating style suggestions:", error);
    throw new Error("Não foi possível gerar sugestões. Tente novamente.");
  }
};

/**
 * Generates the final photorealistic image by combining the model, clothing, and an optional style prompt.
 */
export const generateFinalImage = async (
  modelImageFile: File,
  clothingImageFile: File,
  stylePrompt: string,
  aspectRatio: string
): Promise<string> => {
  const modelImageBase64 = await fileToBase64(modelImageFile);
  const clothingImageBase64 = await fileToBase64(clothingImageFile);

  const prompt = `Generate an image: Take the person from image 1 and dress them with the clothing from image 2. The result must be a photorealistic image. Keep the person's face, hair, skin tone, pose and background exactly the same. The clothing must fit naturally on the body. Aspect ratio: ${aspectRatio}.${stylePrompt.trim() ? ` Style: ${stylePrompt}` : ''}`;

  return callGeminiImageAPI([
    { inlineData: { mimeType: modelImageFile.type, data: modelImageBase64 } },
    { inlineData: { mimeType: clothingImageFile.type, data: clothingImageBase64 } },
    { text: prompt },
  ]);
};

/**
 * Upscales and enhances the quality of a given image.
 */
export const upscaleImage = async (
  imageDataUrl: string
): Promise<string> => {
  const imageBase64 = dataUrlToBase64(imageDataUrl);

  return callGeminiImageAPI([
    { inlineData: { mimeType: 'image/png', data: imageBase64 } },
    { text: `Enhance and upscale this fashion image. Improve sharpness and detail. Keep everything else the same.` },
  ]);
};

/**
 * Generates a new image with a different pose based on an existing generated image.
 */
export const generateNewPose = async (
  imageDataUrl: string,
  aspectRatio: string
): Promise<string> => {
  const imageBase64 = dataUrlToBase64(imageDataUrl);

  return callGeminiImageAPI([
    { inlineData: { mimeType: 'image/png', data: imageBase64 } },
    { text: `Generate a new image of the same person wearing the same clothing but in a different natural pose. Keep all details. Aspect ratio: ${aspectRatio}.` },
  ]);
};
