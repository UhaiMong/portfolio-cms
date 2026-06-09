import { GoogleGenAI } from "@google/genai";

let _genAI: GoogleGenAI | null = null;

export const genAI = (): GoogleGenAI => {
  if (!_genAI) {
    if (!process.env.GEMINI_AI_API_KEY) {
      throw new Error("GEMINI_AI_API_KEY is missing from .env");
    }
    _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });
  }
  return _genAI;
};
