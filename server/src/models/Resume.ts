import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  version: string;
  isActive: boolean;
  downloadCount: number;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    version: { type: String, default: "1.0" },
    isActive: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Only one resume can be active at a time
ResumeSchema.pre("save", async function () {
  if (this.isModified("isActive") && this.isActive) {
    await mongoose
      .model("Resume")
      .updateMany({ _id: { $ne: this._id } }, { isActive: false });
  }
});

export default mongoose.model<IResume>("Resume", ResumeSchema);
