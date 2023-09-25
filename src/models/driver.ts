import mongoose, { Schema } from "mongoose";

const DriverSchema: Schema = new Schema(
    {
        legajo: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

const driverModel = mongoose.model("Driver", DriverSchema);

export default driverModel;