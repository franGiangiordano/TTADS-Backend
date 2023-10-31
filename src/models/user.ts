import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
    name: string;
    email: string;
    password: string;
    roles: mongoose.Types.ObjectId[];
}

interface UserModel extends Model<IUser> {
    comparePassword(pass1: string, pass2: string): boolean;
    encryptPassword(pass: string): string;
}

const UserScheme: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Role",
            },
        ]
    },
    {
        versionKey: false,
    }
)

UserScheme.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

UserScheme.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


const User = mongoose.model<IUser, UserModel>("User", UserScheme)
export default User;