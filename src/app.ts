import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import playerRoutes from "./routes/player.route";
import MatchRouter from "./routes/match.route";
import financeRoutes from "./routes/finance.route";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://football.vercel.app"
        ],
        credentials: true,
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use("/api/players", playerRoutes);

app.use("/api/matches", MatchRouter);

app.use("/api/finance", financeRoutes);

export default app;