import mongoose, { Document, Schema } from "mongoose";

interface ICTAButton {
  label: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
}

export interface IBanner extends Document {
  greeting: string;
  name: string;
  typingTexts: string[]; // animated rotating texts e.g. ["Full Stack Dev", "UI/UX Designer"]
  description: string;
  image: string;
  ctaButtons: ICTAButton[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CTAButtonSchema = new Schema<ICTAButton>(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    variant: {
      type: String,
      enum: ["primary", "secondary", "outline"],
      default: "primary",
    },
  },
  { _id: false },
);

const BannerSchema = new Schema<IBanner>(
  {
    greeting: { type: String, default: "Hi, I'm" },
    name: { type: String, required: [true, "Name is required"] },
    typingTexts: [{ type: String }],
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    ctaButtons: [CTAButtonSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IBanner>("Banner", BannerSchema);
