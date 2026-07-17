import { Schema, model, Types } from "mongoose";

export enum ContributionStatus {
    PAID = "PAID",

    UNPAID = "UNPAID",

    EXCUSED = "EXCUSED",
}

const MonthlyContributionSchema = new Schema(
    {
        year: {
            type: Number,
            required: true,
        },

        month: {
            type: Number,
            required: true,
        },

        playerId: {
            type: Types.ObjectId,
            ref: "Player",
            required: true,
        },

        amount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: Object.values(ContributionStatus),
            default: ContributionStatus.UNPAID,
        },

        note: {
            type: String,
            default: "",
        },

        paidAt: Date,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

MonthlyContributionSchema.index(
    {
        year: 1,
        month: 1,
        playerId: 1,
    },
    {
        unique: true,
    }
);

export default model(
    "MonthlyContribution",
    MonthlyContributionSchema
);