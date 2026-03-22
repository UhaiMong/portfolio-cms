"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.activateResume = exports.uploadResume = exports.getAllResumes = exports.downloadResume = exports.getActiveResume = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const cloudinary_1 = require("../config/cloudinary");
// GET /api/resume  — active resume (public)
exports.getActiveResume = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const resume = await models_1.Resume.findOne({ isActive: true });
    if (!resume)
        throw new errorHandler_1.AppError("No active resume found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Resume fetched", resume);
});
// PATCH /resume/download
exports.downloadResume = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const resume = await models_1.Resume.findOne({ isActive: true });
    if (!resume)
        throw new errorHandler_1.AppError("No active resume found", 404);
    resume.downloadCount += 1;
    await resume.save({ validateBeforeSave: false });
    // Fetch from Cloudinary on server side (no CORS issue)
    const cloudinaryRes = await fetch(resume.fileUrl);
    if (!cloudinaryRes.ok) {
        throw new errorHandler_1.AppError("Failed to fetch resume file", 500);
    }
    const buffer = await cloudinaryRes.arrayBuffer();
    res.setHeader("Content-Disposition", `attachment; filename="${resume.fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", buffer.byteLength);
    res.send(Buffer.from(buffer));
});
// GET /api/resume/all  — all resumes (admin)
exports.getAllResumes = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const resumes = await models_1.Resume.find().sort({ createdAt: -1 });
    (0, apiResponse_1.sendSuccess)(res, 200, "Resumes fetched", resumes);
});
// POST /api/resume/upload
exports.uploadResume = (0, errorHandler_1.catchAsync)(async (req, res) => {
    if (!req.file)
        throw new errorHandler_1.AppError("Please upload a PDF file", 400);
    const file = req.file;
    const resume = await models_1.Resume.create({
        fileName: file.filename,
        fileUrl: file.path,
        fileSize: Math.round(file.size / 1024),
        version: req.body.version || "1.0",
        isActive: req.body.isActive === "true",
    });
    (0, apiResponse_1.sendSuccess)(res, 201, "Resume uploaded", resume);
});
// PATCH /api/resume/:id/activate
exports.activateResume = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await models_1.Resume.updateMany({}, { isActive: false });
    const resume = await models_1.Resume.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!resume)
        throw new errorHandler_1.AppError("Resume not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Resume activated", resume);
});
// DELETE /api/resume/:id
exports.deleteResume = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const resume = await models_1.Resume.findById(req.params.id);
    if (!resume)
        throw new errorHandler_1.AppError("Resume not found", 404);
    // Delete from Cloudinary
    const publicId = `portfolio-cms/resume/${resume.fileName.split(".")[0]}`;
    await cloudinary_1.cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    await resume.deleteOne();
    (0, apiResponse_1.sendSuccess)(res, 200, "Resume deleted", null);
});
