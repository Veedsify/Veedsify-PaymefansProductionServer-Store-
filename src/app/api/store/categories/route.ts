import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        error: false,
        message: "Categories retrieved successfully",
        data: categories,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in GET /api/store/categories:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to retrieve categories",
      },
      { status: 500 },
    );
  }
}
