import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = mongoose
  .connect(process.env.URI!)
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.error(error));

export default connectDB;
