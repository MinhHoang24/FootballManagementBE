import { Router } from "express";
import MatchController from "../controllers/match.controller";
import authMiddleware from "../middlewares/auth.middleware";

const MatchRouter = Router();

// Public
MatchRouter.get("/", MatchController.getAll);
MatchRouter.get("/:id", MatchController.getById);

// Admin
MatchRouter.post("/", authMiddleware, MatchController.create);
MatchRouter.put<{ id: string }>("/:id", authMiddleware, MatchController.update);
MatchRouter.delete<{ id: string }>("/:id", authMiddleware, MatchController.delete);

export default MatchRouter;