import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { trackGemini } from "opik-gemini";

// Opik API key loaded from environment: import.meta.env.VITE_OPIK_API_KEY

// Initialize the original Gemini client
const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Wrap the client with Opik tracking
export const trackedGenAI = trackGemini(genAI);

// Example usage
export async function askGemini(question: string) {
  const response = await trackedGenAI.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: question,
  });

  console.log("Gemini says:", response.text);
  await trackedGenAI.flush();
  return response.text;
}
