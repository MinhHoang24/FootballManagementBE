import bcrypt from "bcrypt";
import Admin from "../models/admin.model";
import { generateToken } from "../utils/jwt";

class AuthService {
    async login(username: string, password: string) {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        const token = generateToken({
            id: admin._id.toString(),
            username: admin.username,
        });

        return {
            token,
            admin: {
                id: admin._id,
                username: admin.username,
            },
        };
    }
}

export default new AuthService();