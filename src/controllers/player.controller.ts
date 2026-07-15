import { Request, Response } from "express";
import PlayerService from "../services/player.service";

interface PlayerParams {
  id: string;
}

class PlayerController {
    async create(req: Request, res: Response) {
        try {
            const player = await PlayerService.create(req.body);

            res.status(201).json({
                success: true,
                data: player,
            });
        } catch (err: any) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }

    async getList(req: Request, res: Response) {
        try {
            const data = await PlayerService.getList(req.query);

            res.json({
                success: true,
                ...data,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async getDetail(req: Request<PlayerParams>, res: Response) {
        try {
            const player = await PlayerService.getDetail(req.params.id);

            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: "Player not found",
                });
            }

            res.json({
                success: true,
                data: player,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async update(req: Request<PlayerParams>, res: Response) {
        try {
            const player = await PlayerService.update(
                req.params.id,
                req.body
            );

            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: "Player not found",
                });
            }

            res.json({
                success: true,
                data: player,
            });
        } catch (err: any) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }

    async remove(req: Request<PlayerParams>, res: Response) {
        try {
            const player = await PlayerService.remove(req.params.id);

            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: "Player not found",
                });
            }

            res.json({
                success: true,
                message: "Delete successfully",
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}

export default new PlayerController();