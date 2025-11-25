import { config } from "@/utils/config";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;

        const countProducts = await prisma.product.count();

        const products = await prisma.product.findMany({
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

        const response = {
          error: false,
          hasMore,
          perPage: Number(limit),
          totalProducts: countProducts,
          message: "Products fetched successfully",
          data: products,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: true, message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
