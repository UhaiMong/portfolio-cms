import { Request, Response } from "express";
import { Project, Blog, Contact, Media, Resume } from "../models";
import { catchAsync } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const [
    totalProjects,
    featuredProjects,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalContacts,
    unreadContacts,
    totalMedia,
    activeResume,
    recentContacts,
    recentProjects,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ featured: true }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "unread" }),
    Media.countDocuments(),
    Resume.findOne({ isActive: true }).select("fileName version downloadCount"),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt"),
    Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status featured views createdAt"),
  ]);

  sendSuccess(res, 200, "Stats fetched", {
    projects: { total: totalProjects, featured: featuredProjects },
    blogs: { total: totalBlogs, published: publishedBlogs, drafts: draftBlogs },
    contacts: { total: totalContacts, unread: unreadContacts },
    media: { total: totalMedia },
    resume: activeResume,
    recentContacts,
    recentProjects,
  });
});
