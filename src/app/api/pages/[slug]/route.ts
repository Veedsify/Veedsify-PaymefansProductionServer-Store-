import { NextResponse, type NextRequest } from "next/server";
import prisma from "prisma/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: true, message: "Slug is required" },
                { status: 400 },
            );
        }

        const page = await prisma.outerPages.findFirst({
          where: {
            slug: slug,
          },
          select: {
            id: true,
            page_id: true,
            slug: true,
            title: true,
            content: true,
            created_at: true,
            updated_at: true,
          },
        });

        if (!page) {
            return NextResponse.json(
                { error: true, message: "Page not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            error: false,
            message: "Page fetched successfully",
            data: page,
        });
    } catch (error) {
        console.error("Error fetching page:", error);
        return NextResponse.json(
            { error: true, message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

