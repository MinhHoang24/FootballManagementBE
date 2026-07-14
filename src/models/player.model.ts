import { Schema, model } from "mongoose";

const playerSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        number: { type: Number, required: true },
        shirtSize: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL"],
            required: true,
        },
        position: {
            type: String,
            enum: ["GK", "CB", "CM", "ST"],
            required: true,
        },
        avatar: { type: String, default: "" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Player", playerSchema);