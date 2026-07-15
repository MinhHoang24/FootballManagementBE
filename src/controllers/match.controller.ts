import { Request, Response } from "express";
import MatchService from "../services/match.service";

interface MatchParams {
    id: string;
}

class MatchController {
    async create(req: Request, res: Response) {
        try {
            const match = await MatchService.create(req.body);

            res.status(201).json({
                success: true,
                data: match,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async update(
        req: Request<MatchParams>,
        res: Response
    ) {
        try {
            const match = await MatchService.update(
                req.params.id,
                req.body
            );

            res.json({
                success: true,
                data: match,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const data = await MatchService.getAll(req.query);

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

    async delete(
        req: Request<MatchParams>,
        res: Response
    ) {
        try {
            const match = await MatchService.delete(req.params.id);

            res.json({
                success: true,
                message: "Match deleted successfully",
                data: match,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}

export default new MatchController();