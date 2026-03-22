"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDelete = exports.deleteContact = exports.updateStatus = exports.getContact = exports.getAllContacts = exports.submitContact = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
// POST /api/contact  — public: submit message
exports.submitContact = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { name, email, subject, message } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "";
    const contact = await models_1.Contact.create({
        name,
        email,
        subject,
        message,
        ipAddress,
    });
    (0, apiResponse_1.sendSuccess)(res, 201, "Message sent successfully! I will get back to you soon.", contact);
});
// GET /api/contact  — admin: all messages
exports.getAllContacts = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total, unreadCount] = await Promise.all([
        models_1.Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        models_1.Contact.countDocuments(filter),
        models_1.Contact.countDocuments({ status: "unread" }),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Contacts fetched", {
        contacts,
        unreadCount,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
        },
    });
});
// GET /api/contact/:id
exports.getContact = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const contact = await models_1.Contact.findByIdAndUpdate(req.params.id, { $set: { status: "read" } }, { new: true });
    if (!contact)
        throw new errorHandler_1.AppError("Message not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Contact fetched", contact);
});
// PATCH /api/contact/:id/status
exports.updateStatus = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { status } = req.body;
    const contact = await models_1.Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact)
        throw new errorHandler_1.AppError("Message not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Status updated", contact);
});
// DELETE /api/contact/:id
exports.deleteContact = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const contact = await models_1.Contact.findByIdAndDelete(req.params.id);
    if (!contact)
        throw new errorHandler_1.AppError("Message not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Message deleted", null);
});
// DELETE /api/contact/bulk  — delete multiple
exports.bulkDelete = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { ids } = req.body;
    await models_1.Contact.deleteMany({ _id: { $in: ids } });
    (0, apiResponse_1.sendSuccess)(res, 200, "Messages deleted", null);
});
