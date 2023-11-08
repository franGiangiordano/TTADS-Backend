import mongoose, { Schema } from "mongoose";

const TrailerScheme: Schema = new Schema(
  {
    patent: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Trailer = mongoose.model("Trailer", TrailerScheme);

export default Trailer;
