"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BlogSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
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
    if (this.isModified("status") &&
        this.status === "published" &&
        !this.publishedAt) {
        this.publishedAt = new Date();
    }
});
BlogSchema.index({ slug: 1, status: 1, featured: 1, tags: 1 });
exports.default = mongoose_1.default.model("Blog", BlogSchema);
