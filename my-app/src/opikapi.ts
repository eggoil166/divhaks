import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// import { opik } from "opik";

// Configure Opik (optional - can comment out)
// opik.configure({
//   apiKey: process.env.VITE_OPIK_API_KEY,
// });

// Initialize the Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY!);

// Get the model
export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp" 
});

// Example usage
export async function askGemini(question: string) {
  
  const result = await model.generateContent(question);
  const response = await result.response;
  const text = response.text();
  
  console.log("Gemini says:", text);
  return text;
}