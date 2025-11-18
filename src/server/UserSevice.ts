import prisma from "prisma/prisma";

class UserService {
    static async getUserById(userId: number): Promise<{
        error: boolean;
        message?: string;
        data?: {
            id: number;
            email: string;
            name: string;
            username: string;
            role: string;
            is_active: boolean;
            is_model: boolean;
            location: string | null;
            user_id: string;
        };
    }> {
        try {
            if (!userId || typeof userId !== "number")
                return {
                    error: true,
                    message: "Invalid user id",
                };
            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    username: true,
                    role: true,
                    is_active: true,
                    is_model: true,
                    location: true,
                    user_id: true,
                },
            });
            return {
                error: !user,
                message: user ? "User found" : "User not found",
                data: user || undefined,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to retrieve user");
        }
    }

    static async getUserByEmail(email: string): Promise<{
        error: boolean;
        message?: string;
        data?: any;
    }> {
        try {
            if (!email || typeof email !== "string")
                return {
                    error: true,
                    message: "Invalid email",
                };
            const user = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
            return {
                error: !user,
                message: user ? "User found" : "User not found",
                data: user,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to retrieve user");
        }
    }
}

export default UserService;
