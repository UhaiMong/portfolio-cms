import mongoose, { Document, Schema } from "mongoose";

interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface ISkill {
  name: string;
  level: number; // 0-100
  category: string;
}

interface IExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  current: boolean;
}

interface IEducation {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  grade?: string;
}

export interface IBio extends Document {
  name: string;
  title: string;
  subtitle: string;
  about: string;
  avatar: string;
  email: string;
  phone?: string;
  location: string;
  availability: "available" | "busy" | "not-available";
  socialLinks: ISocialLink[];
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false },
);

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 50 },
    category: { type: String, required: true },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, default: "" },
  current: { type: Boolean, default: false },
});

const EducationSchema = new Schema<IEducation>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  duration: { type: String, required: true },
  grade: { type: String, default: "" },
});

const BioSchema = new Schema<IBio>(
  {
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
  },
  { timestamps: true },
);

export default mongoose.model<IBio>("Bio", BioSchema);
