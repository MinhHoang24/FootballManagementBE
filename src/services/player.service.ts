import Player from "../models/player.model";

class PlayerService {
    async create(data: any) {
        return Player.create(data);
    }

    async update(id: string, data: any) {
        return Player.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async remove(id: string) {
        return Player.findByIdAndDelete(id);
    }

    async getDetail(id: string) {
        return Player.findById(id);
    }

    async getList(query: any) {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
            season,
        } = query;

        const filter: any = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        const skip = (+page - 1) * +limit;

        const sort: any = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const pipeline: any[] = [
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "playerseasonstats",
                    let: {
                        playerId: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$playerId",
                                        "$$playerId",
                                    ],
                                },
                            },
                        },
                    ],
                    as: "seasonStats",
                },
            },
        ];

        if (season) {
            pipeline.push(
                {
                    $addFields: {
                        seasonStats: {
                            $filter: {
                                input: "$seasonStats",
                                as: "item",
                                cond: {
                                    $eq: [
                                        "$$item.season",
                                        Number(season),
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $unwind: {
                        path: "$seasonStats",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        goals: {
                            $ifNull: [
                                "$seasonStats.goals",
                                0,
                            ],
                        },
                        assists: {
                            $ifNull: [
                                "$seasonStats.assists",
                                0,
                            ],
                        },
                        ga: {
                            $ifNull: [
                                "$seasonStats.ga",
                                0,
                            ],
                        },
                    },
                }
            );
        }

        pipeline.push(
            {
                $sort: sort,
            },
            {
                $skip: skip,
            },
            {
                $limit: Number(limit),
            }
        );

        const [items, total] = await Promise.all([
            Player.aggregate(pipeline),
            Player.countDocuments(filter),
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
}

export default new PlayerService();