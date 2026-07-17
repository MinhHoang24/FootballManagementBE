import { Schema, model } from "mongoose";

const goalSchema = new Schema(
    {
        // Bàn thắng thuộc đội nào
        team: {
            type: String,
            enum: ["OUR", "OPPONENT"],
            required: true,
        },

        // Loại bàn thắng
        type: {
            type: String,
            enum: ["NORMAL", "OWN_GOAL"],
            default: "NORMAL",
        },

        // Cầu thủ ghi bàn (null nếu phản lưới)
        scorerPlayerId: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            default: null,
        },

        // Cầu thủ kiến tạo (có thể null)
        assistPlayerId: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            default: null,
        },

        // Phút ghi bàn (để sau này hiển thị timeline)
        minute: {
            type: Number,
            min: 0,
            max: 130,
            default: null,
        },
    },
    {
        _id: false,
    }
);

const matchSchema = new Schema(
    {
        season: {
            type: Number,
            required: true,
        },

        opponent: {
            type: String,
            required: true,
            trim: true,
        },

        matchDate: {
            type: Date,
            required: true,
        },

        goals: {
            type: [goalSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Tính tỷ số từ danh sách bàn thắng
matchSchema.virtual("score").get(function () {
    const goals = this.goals as any[];

    const our = goals.filter(
        goal => goal.team === "OUR"
    ).length;

    const opponent = goals.filter(
        goal => goal.team === "OPPONENT"
    ).length;

    return {
        our,
        opponent,
    };
});

export default model("Match", matchSchema);