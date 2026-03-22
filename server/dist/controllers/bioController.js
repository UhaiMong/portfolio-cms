"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEducation = exports.updateExperience = exports.updateSkills = exports.updateBio = exports.createBio = exports.getBio = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
// GET /api/bio  — always returns the single bio document
exports.getBio = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const bio = await models_1.Bio.findOne().sort({ createdAt: -1 });
    if (!bio)
        throw new errorHandler_1.AppError("Bio not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Bio fetched", bio);
});
// POST /api/bio  — create if none exists
exports.createBio = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const existing = await models_1.Bio.findOne();
    if (existing)
        throw new errorHandler_1.AppError("Bio already exists. Use PATCH to update.", 400);
    const bio = await models_1.Bio.create(req.body);
    (0, apiResponse_1.sendSuccess)(res, 201, "Bio created", bio);
});
// PATCH /api/bio/:id
exports.updateBio = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const bio = await models_1.Bio.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bio)
        throw new errorHandler_1.AppError("Bio not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Bio updated", bio);
});
// PATCH /api/bio/:id/skills  — replace entire skills array
exports.updateSkills = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const bio = await models_1.Bio.findByIdAndUpdate(req.params.id, { skills: req.body.skills }, { new: true });
    if (!bio)
        throw new errorHandler_1.AppError("Bio not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Skills updated", bio);
});
// PATCH /api/bio/:id/experience
exports.updateExperience = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const bio = await models_1.Bio.findByIdAndUpdate(req.params.id, { experience: req.body.experience }, { new: true });
    if (!bio)
        throw new errorHandler_1.AppError("Bio not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Experience updated", bio);
});
// PATCH /api/bio/:id/education
exports.updateEducation = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const bio = await models_1.Bio.findByIdAndUpdate(req.params.id, { education: req.body.education }, { new: true });
    if (!bio)
        throw new errorHandler_1.AppError("Bio not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Education updated", bio);
});
