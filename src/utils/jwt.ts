import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    username: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};