// Helper to convert File to Base64
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

const API_KEY = process.env.GEMINI_API_KEY;
const PROJECT_ID = 'projects/956278657761'; // This should be from the API key

/**
 * Generates images using Imagen API
 */
export const generateImageWithImagen = async (
  prompt: string,
  imageBase64?: string,
  mimeType?: string
): Promise<string> => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/files:generateContent`;

    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    // If we have an image, add it as context
    if (imageBase64 && mimeType) {
      requestBody.contents[0].parts.unshift({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      });
    }

    console.log("Calling Imagen API with prompt:", prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Imagen API response:", data);

    // Extract image from response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts;
      if (Array.isArray(parts)) {
        for (const part of parts) {
          if (part.inlineData) {
            return part.inlineData.data;
          }
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error calling Imagen API:", error);
    throw error;
  }
};

/**
 * Generates virtual try-on image
 */
export const generateVirtualTryOn = async (
  modelImageFile: File,
  clothingImageFile: File,
  stylePrompt: string,
  aspectRatio: string
): Promise<string> => {
  try {
    const modelImageBase64 = await fileToBase64(modelImageFile);
    const clothingImageBase64 = await fileToBase64(clothingImageFile);

    const prompt = `Create a photorealistic image of a person wearing different clothing.

Base image (first reference): A person in their original outfit
Clothing reference (second reference): The new clothing piece to wear

Create a realistic image where the person is wearing the clothing from the second image.
Keep the person's face, pose, and background identical to the base image.
Make the clothing fit naturally and realistically to the person's body.
Maintain all clothing details like colors, patterns, and logos.
${stylePrompt ? `Additional style: ${stylePrompt}` : ''}
Aspect ratio: ${aspectRatio}`;

    // Try using both images as context
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: modelImageFile.type,
                data: modelImageBase64
              }
            },
            {
              inlineData: {
                mimeType: clothingImageFile.type,
                data: clothingImageBase64
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    console.log("Calling Imagen API for virtual try-on...");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Imagen API error response:", errorData);
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Imagen API response:", data);

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts;
      if (Array.isArray(parts)) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            console.log("Image generated successfully");
            return part.inlineData.data;
          }
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error generating virtual try-on:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Erro ao gerar imagem: ${errorMessage}`);
  }
};
