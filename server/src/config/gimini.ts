// import { GoogleGenAI } from "@google/genai";

// if (!process.env.GEMINI_AI_API_KEY) {
//   throw new Error("GEMINI_AI_API_KEY is missing from .env");
// }

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

// export const geminiModel = async (systemPrompt: string, userPrompt: string) => {
//   return await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: userPrompt, // The user input goes here
//     config: {
//       // System instructions are now strings passed inside the unified config object
//       systemInstruction: systemPrompt,
//       maxOutputTokens: 500,
//       temperature: 0.7,
//     },
//   });
// };

import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_AI_API_KEY) {
  throw new Error("GEMINI_AI_API_KEY is missing from .env");
}

export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });
