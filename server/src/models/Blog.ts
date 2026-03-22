import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  tags: string[];
  category: string;
  status: "published" | "draft";
  featured: boolean;
  readTime: number;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: 300,
    },
    content: { type: String, required: [true, "Content is required"] },
    thumbnail: { type: String, required: [true, "Thumbnail is required"] },
    tags: [{ type: String, trim: true }],
    category: { type: String, required: true, trim: true },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    featured: { type: Boolean, default: false },
    readTime: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

// Auto-generate slug & calculate read time
BlogSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (this.isModified("content")) {
    const wordCount = this.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

BlogSchema.index({ slug: 1, status: 1, featured: 1, tags: 1 });

export default mongoose.model<IBlog>("Blog", BlogSchema);
