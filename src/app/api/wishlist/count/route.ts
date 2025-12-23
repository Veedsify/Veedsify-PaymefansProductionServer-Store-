import { NextResponse } from "next/server";
import { auth } from "@auth";
import prisma from "prisma/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: true,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);

    const count = await prisma.wishList.count({
      where: { user_id: userId },
    });

    return NextResponse.json(
      {
        error: false,
        message: "Wishlist count retrieved successfully",
        data: count,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in GET /api/wishlist/count:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to get wishlist count",
      },
      { status: 500 },
    );
  }
}
