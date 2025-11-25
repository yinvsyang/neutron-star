import { GoogleGenAI } from "@google/genai";
import { StarStage } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStageExplanation = async (stage: StarStage, userQuestion?: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI service unavailable (Missing API Key).";

  const basePrompt = `You are an expert astrophysicist explaining stellar evolution to a student. 
  The current visual context is: ${stage.replace('_', ' ')}.`;

  const specificPrompt = userQuestion 
    ? `The user asks: "${userQuestion}". Keep the answer concise (under 100 words) and engaging.`
    : `Provide a concise, fascinating fun fact about this specific stage of formation (under 60 words).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}\n\n${specificPrompt}`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to retrieve cosmic data at this moment.";
  }
};

export const streamChatResponse = async (history: string[], message: string, onChunk: (text: string) => void) => {
  const ai = getAIClient();
  if (!ai) {
    onChunk("Error: API Key missing.");
    return;
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are 'Pulsar', an AI guide specializing in neutron stars and astrophysics. Keep answers scientifically accurate but accessible. Keep responses relatively brief.",
      }
    });

    // Pre-load history simplified for this context (optional, but good for continuity)
    // For simplicity in this demo, we just send the message
    
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
        if (chunk.text) {
            onChunk(chunk.text);
        }
    }
  } catch (error) {
    console.error("Chat Error:", error);
    onChunk("Communication link with Deep Space Network failed.");
  }
};
