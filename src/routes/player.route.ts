import { Router } from "express";
import playerController from "../controllers/player.controller";
import authMiddleware from "../middlewares/auth.middleware";

const playerRoutes = Router();

playerRoutes.post("/", authMiddleware, playerController.create);

playerRoutes.get("/", playerController.getList);

playerRoutes.get("/:id", playerController.getDetail);

playerRoutes.put<{ id: string }>(
    "/:id",
    authMiddleware,
    playerController.update
);

playerRoutes.delete<{ id: string }>(
    "/:id",
    authMiddleware,
    playerController.remove
);

export default playerRoutes;