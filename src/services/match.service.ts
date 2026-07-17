import Match from "../models/match.model";
import PlayerSeasonStatService from "./player-season-stat.service";

class MatchService {

    async create(body: any) {

        const match = await Match.create(body);

        await PlayerSeasonStatService.recalculateSeason(match.season);

        return this.getById(match.id);
    }

    async update(id: string, body: any) {

        const match = await Match.findById(id);

        if (!match) {
            throw new Error("Match not found");
        }

        const oldSeason = match.season;

        Object.assign(match, body);

        await match.save();

        if (oldSeason !== match.season) {
            await PlayerSeasonStatService.recalculateSeason(oldSeason);
        }

        await PlayerSeasonStatService.recalculateSeason(match.season);

        return this.getById(id);
    }

    async getAll(query: any) {

        const {
            page = 1,
            limit = 10,
            season,
            search = "",
            sortBy = "matchDate",
            sortOrder = "desc",
        } = query;

        const filter: any = {};

        if (season) {
            filter.season = Number(season);
        }

        if (search) {
            filter.opponent = {
                $regex: search,
                $options: "i",
            };
        }

        const skip = (+page - 1) * +limit;

        const sort: any = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const [items, total] = await Promise.all([
            Match.find(filter)
                .populate("goals.scorerPlayerId", "name number")
                .populate("goals.assistPlayerId", "name number")
                .sort(sort)
                .skip(skip)
                .limit(+limit),

            Match.countDocuments(filter),
        ]);

        return {
            items,
            pagination: {
                page: +page,
                limit: +limit,
                total,
                totalPages: Math.ceil(total / +limit),
            },
        };
    }

    async getById(id: string) {

        const match = await Match.findById(id)
            .populate("goals.scorerPlayerId", "name number")
            .populate("goals.assistPlayerId", "name number");

        if (!match) {
            throw new Error("Match not found");
        }

        return match;
    }

    async delete(id: string) {

        const match = await Match.findById(id);

        if (!match) {
            throw new Error("Match not found");
        }

        await Match.findByIdAndDelete(id);

        await PlayerSeasonStatService.recalculateSeason(match.season);
    }
}

export default new MatchService();