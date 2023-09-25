import mongoose, { Schema } from "mongoose";

const UserScheme: Schema = new Schema(
    {
        name:{
            type:String,
            required: true,
            unique: true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
        },
        password:{
            type:String,
            required: true,
            select: false
        }, 
        role:{
            type:["operative, manager, admin"],
            default: "operative" 
        }
    },
    {
        versionKey: false,
    }
)

const userModel = mongoose.model("User", UserScheme)

export default userModel;