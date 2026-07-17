import Match from "../models/match.model";
import playerSeasonStats from "../models/player.season.stats";

class PlayerSeasonStatService {
    async recalculateSeason(season: number) {
        const matches = await Match.find({ season });

        const stats = new Map<
            string,
            {
                goals: number;
                assists: number;
            }
        >();

        for (const match of matches) {
            for (const goal of Array.from(match.goals as any)) {
                if (goal.scorerPlayerId) {
                    const id = goal.scorerPlayerId.toString();

                    if (!stats.has(id)) {
                        stats.set(id, {
                            goals: 0,
                            assists: 0,
                        });
                    }

                    stats.get(id)!.goals++;
                }

                if (goal.assistPlayerId) {
                    const id = goal.assistPlayerId.toString();

                    if (!stats.has(id)) {
                        stats.set(id, {
                            goals: 0,
                            assists: 0,
                        });
                    }

                    stats.get(id)!.assists++;
                }
            }
        }

        await playerSeasonStats.deleteMany({
            season,
        });

        const docs = [...stats.entries()].map(([playerId, stat]) => ({
            playerId,
            season,
            goals: stat.goals,
            assists: stat.assists,
            ga: stat.goals + stat.assists,
        }));

        if (docs.length) {
            await playerSeasonStats.insertMany(docs);
        }
    }
}

export default new PlayerSeasonStatService();