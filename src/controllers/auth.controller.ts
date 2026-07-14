import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username and password are required",
                });
            }

            const result = await authService.login(username, password);

            res.cookie("access_token", result.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                success: true,
                admin: result.admin,
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }
    async logout(req: Request, res: Response) {
        res.clearCookie("access_token");

        return res.json({
            success: true,
        });
    }
    async me(req: Request, res: Response) {
        return res.json({
            success: true,
            admin: req.admin,
        });
    }
}

export default new AuthController();