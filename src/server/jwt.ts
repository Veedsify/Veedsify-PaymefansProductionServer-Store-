import * as jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
// Environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-fallback-secret";
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "24h";

//
async function GenerateAuthToken(data: {
    id: number;
    active_status: boolean;
    email: string;
    username: string;
    user_id: string;
    name: string;
    should_delete: boolean;
}): Promise<{ accessToken: string }> {
    const payload = { ...data };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
    } as SignOptions);

    return { accessToken };
}
export { GenerateAuthToken };
