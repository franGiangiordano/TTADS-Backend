import mongoose from "mongoose";

const TravelSchema = new mongoose.Schema(
    {
        departure_date: {
            type: Date,
            required: true,
        },        
        arrival_date:{
            type: Date,
            required: true,
        },
        cost:{
            type: Number,
            required: true,
        },
        km:{
            type: Number,
            required: true,
        },
        starting_location: {
            type: String,
            required: true,
        },
        final_location: {
            type: String,
            required: true,
        },
        equipment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
            required: true,            
        }        
    },
    {
        versionKey: false,
    }
)
  
const Travel = mongoose.model("Travel", TravelSchema);

export default Travel;
