import type { Request, Response } from "express";
import { Contact } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";

// POST /api/contact  — public: submit message
export const submitContact = catchAsync(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  const ipAddress = req.ip || (req.headers["x-forwarded-for"] as string) || "";

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    ipAddress,
  });
  sendSuccess(
    res,
    201,
    "Message sent successfully! I will get back to you soon.",
    contact,
  );
});

// GET /api/contact  — admin: all messages
export const getAllContacts = catchAsync(
  async (req: Request, res: Response) => {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total, unreadCount] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
      Contact.countDocuments({ status: "unread" }),
    ]);

    sendSuccess(res, 200, "Contacts fetched", {
      contacts,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  },
);

// GET /api/contact/:id
export const getContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "read" } },
    { new: true },
  );
  if (!contact) throw new AppError("Message not found", 404);
  sendSuccess(res, 200, "Contact fetched", contact);
});

// PATCH /api/contact/:id/status
export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!contact) throw new AppError("Message not found", 404);
  sendSuccess(res, 200, "Status updated", contact);
});

// DELETE /api/contact/:id
export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new AppError("Message not found", 404);
  sendSuccess(res, 200, "Message deleted", null);
});

// DELETE /api/contact/bulk  — delete multiple
export const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  await Contact.deleteMany({ _id: { $in: ids } });
  sendSuccess(res, 200, "Messages deleted", null);
});
