import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  videoId?: string;
  category: string;
  status: "completed" | "in-progress" | "archived";
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  order: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, "Description is required"] },
    longDescription: { type: String, default: "" },
    thumbnail: { type: String, required: [true, "Thumbnail is required"] },
    images: [{ type: String }],
    techStack: [{ type: String, trim: true }],
    videoId: { type: String, default: "iEk1breHiGE?si=pCAzSiRxC6pbFW7o" },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    featured: { type: Boolean, default: false },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Auto-generate slug from title
ProjectSchema.pre("save", async function () {
  if (!this.isModified("title")) return;
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
});

// Index for faster queries
ProjectSchema.index({ slug: 1, featured: 1, status: 1, order: 1 });

export default mongoose.model<IProject>("Project", ProjectSchema);
