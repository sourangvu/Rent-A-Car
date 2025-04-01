import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },

        role: {
            type: String,
            enum: ["admin"],
            default: 'admin'
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        profilePic: {
            type: String,
            default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
        },
        qualification: {
            type: String
        },
        vehicles: [{ type: mongoose.Types.ObjectId, ref: "car" }],
    },
    { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
