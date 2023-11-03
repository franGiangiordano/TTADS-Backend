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

const Role = mongoose.model("Role", roleSchema);

export default Role;
