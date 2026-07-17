import { Schema, model, Types } from "mongoose";

export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
}

export enum TransactionCategory {
    MONTHLY_FEE = "MONTHLY_FEE",

    FIELD = "FIELD",

    WATER = "WATER",

    FOOD = "FOOD",

    OTHER = "OTHER",
}

const FinanceTransactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },

        category: {
            type: String,
            enum: Object.values(TransactionCategory),
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            default: "",
        },

        transactionDate: {
            type: Date,
            required: true,
        },

        contributionId: {
            type: Types.ObjectId,
            ref: "MonthlyContribution",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

FinanceTransactionSchema.index({
    transactionDate: -1,
});

export default model(
    "FinanceTransaction",
    FinanceTransactionSchema
);