import { NextResponse, type NextRequest } from "next/server";
import prisma from "prisma/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> },
) {
    try {
        const { category } = await params;

        if (!category || !["main", "store"].includes(category)) {
            return NextResponse.json(
                { error: true, message: "Invalid category. Must be 'main' or 'store'" },
                { status: 400 },
            );
        }

        const socialLinks = await prisma.socialLink.findMany({
            where: {
                category: category as "main" | "store",
            },
            orderBy: {
                created_at: "asc",
            },
        });

        return NextResponse.json({
            error: false,
            socialLinks,
            message: "Social links retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching social links:", error);
        return NextResponse.json(
            { error: true, message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

