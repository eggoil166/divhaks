// src/test-gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY!;
if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function askGemini(prompt: string): Promise<string> {
  const res = await model.generateContent(prompt);
  // @ts-ignore: SDK'nin .text() yardımcı fonksiyonu
  return res?.response?.text?.() ?? "(no response)";
}
