import mongoose from "mongoose";

export const ROLES = ["operative", "admin", "manager"];

const roleSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);
export default mongoose.model("Role", roleSchema);