import { Bio, Blog, Project, Resume } from "../models";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { buildSystemPrompt } from "../utils/buildPrompt";
import { catchAsync } from "../utils/errorHandler";
import type { Request, Response } from "express";
import { genAI } from "../config/gimini";

export const chat = catchAsync(async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return sendError(res, 400, "Message is required");
    }

    const [bio, resume, projects, blog] = await Promise.all([
      Bio.find().sort({ createdAt: -1 }),
      Resume.find().sort({ createdAt: -1 }),
      Project.find().sort({ createdAt: -1 }),
      Blog.find().sort({ createdAt: -1 }),
    ]);

    const systemPrompt = buildSystemPrompt({ bio, resume, projects, blog });

    const formattedHistory = history
      .filter((m: any) => m.role && m.content)
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 500,
        temperature: 0.7,
      },
      contents: [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: message.trim() }],
        },
      ],
    });

    const reply = response.text ?? "Sorry, I could not generate a response.";

    sendSuccess(res, 200, "Reply generated", { reply });
  } catch (error: any) {
    console.error("CHATBOT ERROR:", error?.message || error);
    return sendError(res, 500, error?.message || "Internal error");
  }
});
