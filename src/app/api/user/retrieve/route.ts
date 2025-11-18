import { NextRequest, NextResponse } from "next/server";
import UserService from "@/server/UserSevice";
import { ExtendedWithUser } from "@/types/handlers";

export async function GET(request: ExtendedWithUser) {
    try {
        const userId = request.user.userId;
        if (!userId) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Invalid user id",
                },
                { status: 400 },
            );
        }
        const users = await UserService.getUserById(userId);
        if (users.error) {
            return NextResponse.json(users, { status: 400 });
        }
        return NextResponse.json(users);
    } catch (error) {
        // console.error(error);
        return NextResponse.json(
            {
                error: true,
                message: "Failed to retrieve user",
            },
            { status: 400 },
        );
    }
}
