"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.getStats = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const [totalProjects, featuredProjects, totalBlogs, publishedBlogs, draftBlogs, totalContacts, unreadContacts, totalMedia, activeResume, recentContacts, recentProjects,] = await Promise.all([
        models_1.Project.countDocuments(),
        models_1.Project.countDocuments({ featured: true }),
        models_1.Blog.countDocuments(),
        models_1.Blog.countDocuments({ status: "published" }),
        models_1.Blog.countDocuments({ status: "draft" }),
        models_1.Contact.countDocuments(),
        models_1.Contact.countDocuments({ status: "unread" }),
        models_1.Media.countDocuments(),
        models_1.Resume.findOne({ isActive: true }).select("fileName version downloadCount"),
        models_1.Contact.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email subject status createdAt"),
        models_1.Project.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title status featured views createdAt"),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Stats fetched", {
        projects: { total: totalProjects, featured: featuredProjects },
        blogs: { total: totalBlogs, published: publishedBlogs, drafts: draftBlogs },
        contacts: { total: totalContacts, unread: unreadContacts },
        media: { total: totalMedia },
        resume: activeResume,
        recentContacts,
        recentProjects,
    });
});
