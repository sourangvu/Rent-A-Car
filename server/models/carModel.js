import mongoose, { Schema } from "mongoose";

const carSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        brand: {
            type: String,  
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        year: {
            type: Number, 
            required: true,
            min: 1900,  
            max: new Date().getFullYear(),
        },
        model: {
            type: String, 
            required: true,
            minLength: 2,
            maxLength: 50,
        },
        description: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 150, 
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: "https://image.pngaaa.com/13/1887013-middle.png",
        },
        admin: {
            type: mongoose.Types.ObjectId,
            ref: "Admin", 
        },
    },
    { timestamps: true }
);

export const Car = mongoose.model("Car", carSchema);