import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  phoneLast4: string;
  department: string;
  avatar: string;
  bio?: string;
  wishlist?: string;
  questions: { question: string; answer: string }[];
  hasViewed: boolean;
  viewedAt?: Date;
  createdAt: Date;
}

export interface IMatchDoc extends Document {
  santaId: string;
  santaName: string;
  santaEmail: string;
  santaDepartment: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientDepartment: string;
  hints: string[];
  matchedAt: Date;
}

export interface ISettingsDoc extends Document {
  key: string;
  rules: string;
  eventDate: string;
  revealDate: string;
  companyDomain?: string;
  companyName?: string;
  companyLogo?: string;
  penalties: string[];
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneLast4: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    wishlist: { type: String, default: "" },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    hasViewed: { type: Boolean, default: false },
    viewedAt: { type: Date },
  },
  { timestamps: true }
);

const MatchSchema = new Schema<IMatchDoc>(
  {
    santaId: { type: String, required: true },
    santaName: { type: String, required: true },
    santaEmail: { type: String, required: true },
    santaDepartment: { type: String, required: true },
    recipientId: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    recipientDepartment: { type: String, required: true },
    hints: [{ type: String }],
    matchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SettingsSchema = new Schema<ISettingsDoc>({
  key: { type: String, required: true, unique: true, default: "global" },
  rules: { type: String, default: "" },
  eventDate: { type: String, default: "2026-12-24T18:00:00" },
  revealDate: { type: String, default: "2026-11-27T00:00:00" },
  companyDomain: { type: String, default: "" },
  companyName: { type: String, default: "GLOBAL SAFE" },
  companyLogo: { type: String, default: "/assets/logo.png" },
  penalties: [{ type: String }],
});

export const UserModel: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);

export const MatchModel: Model<IMatchDoc> =
  mongoose.models.Match || mongoose.model<IMatchDoc>("Match", MatchSchema);

export const SettingsModel: Model<ISettingsDoc> =
  mongoose.models.Settings || mongoose.model<ISettingsDoc>("Settings", SettingsSchema);
