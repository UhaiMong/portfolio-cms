import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_AI_API_KEY) {
  throw new Error("GEMINI_AI_API_KEY is missing from .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY);

export const geminiModel = (systemPrompt: string) =>
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: {
      // 👈 object here too
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  });
