import mongoose from "mongoose";

export interface IUser {
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  password: string;
  name: string;
  deleted?: boolean;
  banned?: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
      trim: true,
    },
    password: { type: String },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
