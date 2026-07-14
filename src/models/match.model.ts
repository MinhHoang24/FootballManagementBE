import { Schema, model } from "mongoose";

const goalSchema = new Schema(
  {
    scorerPlayerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    assistPlayerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
  },
  { _id: false }
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

    score: {
      our: {
        type: Number,
        required: true,
      },

      opponent: {
        type: Number,
        required: true,
      },
    },

    goals: [goalSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Match", matchSchema);