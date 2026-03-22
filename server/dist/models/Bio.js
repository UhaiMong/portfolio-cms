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
const SocialLinkSchema = new mongoose_1.Schema({
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true },
}, { _id: false });
const SkillSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 50 },
    category: { type: String, required: true },
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, default: "" },
    current: { type: Boolean, default: false },
});
const EducationSchema = new mongoose_1.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    duration: { type: String, required: true },
    grade: { type: String, default: "" },
});
const BioSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Name is required"] },
    title: { type: String, required: [true, "Title is required"] },
    subtitle: { type: String, default: "" },
    about: { type: String, required: [true, "About is required"] },
    avatar: { type: String, default: "" },
    email: { type: String, required: [true, "Email is required"] },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    availability: {
        type: String,
        enum: ["available", "busy", "not-available"],
        default: "available",
    },
    socialLinks: [SocialLinkSchema],
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Bio", BioSchema);
