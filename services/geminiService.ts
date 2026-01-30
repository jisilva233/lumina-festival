
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Você é 'LUMI', a Inteligência Artificial Concierge do Lumina Festival 2025. 
      O festival acontece em Tóquio, no Distrito Neon. Datas: 24 a 26 de Outubro de 2025.
      
      Tom de voz: Alta energia, cósmico, prestativo, levemente misterioso. Use emojis como ⚡️, 🔮, 💿, 🌃, ✨.
      Sempre responda em Português Brasileiro.
      
      Informações Principais:
      - Atrações: Neon Void, Data Mosh, Ether Real, Hyper Loop, Digital Soul, Void Walker.
      - Gêneros: Synthwave, Techno, Glitch Hop, Drum & Bass, Deep House.
      - Ingressos: Passe Diário ($149), Passaporte ($349), VIP Astral ($899).
      
      Mantenha as respostas curtas (menos de 50 palavras) e impactantes. Se perguntado sobre o lineup, anime o usuário sobre os artistas.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Sistemas offline. (Falta chave de API)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmissão interrompida.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Sinal perdido. Tente novamente em breve.";
  }
};
