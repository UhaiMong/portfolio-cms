import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document {
  fileName: string;
  originalName: string;
  fileUrl: string;
  publicId: string; // Cloudinary public_id for deletion
  fileType: "image" | "pdf" | "other";
  mimeType: string;
  fileSize: number; // in KB
  width?: number;
  height?: number;
  folder: string;
  usedIn?: string; // e.g. "project", "blog", "bio"
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["image", "pdf", "other"],
      default: "image",
    },
    mimeType: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "general" },
    usedIn: { type: String, default: "" },
  },
  { timestamps: true },
);

MediaSchema.index({ fileType: 1, folder: 1 });

export default mongoose.model<IMedia>("Media", MediaSchema);
