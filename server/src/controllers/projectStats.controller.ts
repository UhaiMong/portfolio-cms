import { Project } from "../models";
import { sendSuccess } from "../utils/apiResponse";
import { Request, Response } from "express";
import { AppError, catchAsync } from "../utils/errorHandler";

export const getProjectStats = catchAsync(
  async (req: Request, res: Response) => {
    const totalProject = await Project.countDocuments();

    if (totalProject === 0) {
      throw new AppError("No projects found", 404);
    }

    sendSuccess(res, 200, "Total completed projects", totalProject);
  },
);
