import { Schema, model } from "mongoose";

const playerSeasonStatSchema = new Schema(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    season: {
      type: Number,
      required: true,
    },

    goals: {
      type: Number,
      default: 0,
    },

    assists: {
      type: Number,
      default: 0,
    },

    ga: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

playerSeasonStatSchema.index(
  {
    playerId: 1,
    season: 1,
  },
  {
    unique: true,
  }
);

export default model("PlayerSeasonStat", playerSeasonStatSchema);