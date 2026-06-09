import { geminiModel } from "../config/gimini";
import { Bio, Blog, Project, Resume } from "../models";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { buildSystemPrompt } from "../utils/buildPrompt";
import { catchAsync } from "../utils/errorHandler";
import type { Request, Response } from "express";

// chatbot.controller.ts
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

    const model = geminiModel(systemPrompt);

    const chatSession = model.startChat({
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(message.trim());
    const reply = result.response.text();

    sendSuccess(res, 200, "Reply generated", { reply });
  } catch (error: any) {
    // 👇 This will show exact error in terminal
    console.error("CHATBOT ERROR:", error?.message || error);
    return sendError(res, 500, error?.message || "Internal error");
  }
});
