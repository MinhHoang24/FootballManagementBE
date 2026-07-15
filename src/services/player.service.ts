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
        await new Promise((resolve) => setTimeout(resolve, 4000));

        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
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

        const [items, total] = await Promise.all([
            Player.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(+limit),

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