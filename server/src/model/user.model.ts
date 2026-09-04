import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        email: String,
        phoneNumber: String,
        password: String,
        address: String,
        isVerified: Boolean,
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER",
        },
    },
    { timestamps: true }
);

export const UserModel = model("user", UserSchema);