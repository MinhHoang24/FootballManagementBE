import { Router } from "express";
import MatchController from "../controllers/match.controller";
import authMiddleware from "../middlewares/auth.middleware";

const MatchRouter = Router();

MatchRouter.get("/", MatchController.getAll);

MatchRouter.post("/", authMiddleware, MatchController.create);

MatchRouter.put<{ id: string }>("/:id", authMiddleware, MatchController.update);

MatchRouter.delete<{ id: string }>("/:id", authMiddleware, MatchController.delete);

export default MatchRouter;