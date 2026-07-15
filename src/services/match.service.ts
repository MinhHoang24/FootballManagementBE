import Match from "../models/match.model";
import PlayerSeasonStatService from "./player-season-stat.service";

class MatchService {
    async create(body: any) {
        const match = await Match.create(body);

        await PlayerSeasonStatService.recalculateSeason(match.season);

        return match;
    }

    async update(id: string, body: any) {
        const oldMatch = await Match.findById(id);

        if (!oldMatch) {
            throw new Error("Match not found");
        }

        const oldSeason = oldMatch.season;

        Object.assign(oldMatch, body);

        await oldMatch.save();

        if (oldSeason !== oldMatch.season) {
            await PlayerSeasonStatService.recalculateSeason(oldSeason);
        }

        await PlayerSeasonStatService.recalculateSeason(oldMatch.season);

        return oldMatch;
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

    async delete(id: string) {
        const match = await Match.findById(id);

        if (!match) {
            throw new Error("Match not found");
        }

        const season = match.season;

        await Match.findByIdAndDelete(id);

        // Cập nhật lại thống kê của mùa sau khi xóa trận đấu
        await PlayerSeasonStatService.recalculateSeason(season);

        return match;
    }
}

export default new MatchService();