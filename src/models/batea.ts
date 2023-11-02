import mongoose from "mongoose";

const BateaSchema = new mongoose.Schema(
  {
    patent: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

const Batea = mongoose.model("Batea", BateaSchema);

export default Batea;
