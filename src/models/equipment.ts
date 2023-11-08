import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        until_date: {
            type: Date,
            required: true,
        },
        driver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
        },
        batea:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batea",
            required: true,
        },
        trailer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trailer",
            required: true,
        },
    },
    {
        versionKey: false,
    }
)

EquipmentSchema.index(
    { driver: 1, batea: 1, trailer: 1 },
    { unique: true }
  );
  
const Equipment = mongoose.model("Equipment", EquipmentSchema);

export default Equipment;
