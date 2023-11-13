import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
    {
        description: {
            type: String,
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
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

EquipmentSchema.index(
    { driver: 1, batea: 1, trailer: 1 },
    { unique: true }
  );
  
const Equipment = mongoose.model("Equipment", EquipmentSchema);

export default Equipment;
