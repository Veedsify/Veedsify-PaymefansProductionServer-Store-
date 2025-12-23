import { config } from "@/utils/config";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "prisma/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const categoryIdNum = Number(categoryId);

    if (isNaN(categoryIdNum)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid category ID",
        },
        { status: 400 },
      );
    }

    // Verify category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryIdNum },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: true,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    const countProducts = await prisma.product.count({
      where: { category_id: categoryIdNum },
    });

    const products = await prisma.product.findMany({
      where: { category_id: categoryIdNum },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        instock: true,
        product_id: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            image_url: true,
          },
        },
        sizes: {
          select: {
            size: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit) + 1,
      orderBy: {
        id: "desc",
      },
    });

    let hasMore = false;
    if (products.length > Number(limit)) {
      hasMore = true;
      products.pop(); // Remove the last item to fit the limit
    }

    // Format products with CloudFront URLs
    const formattedProducts = products.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        id: img.id,
        image_url: `${config.cloudFrontUrl}/${img.image_url}`,
      })),
    }));

    return NextResponse.json(
      {
        error: false,
        hasMore,
        perPage: Number(limit),
        totalProducts: countProducts,
        message: "Products fetched successfully",
        data: formattedProducts,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Error in GET /api/store/categories/[categoryId]/products:",
      error,
    );
    return NextResponse.json(
      {
        error: true,
        message: error.message || "Failed to retrieve products",
      },
      { status: 500 },
    );
  }
}
