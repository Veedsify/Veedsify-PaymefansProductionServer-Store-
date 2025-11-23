import { config } from "@/utils/config";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "prisma/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> },
) {
    try {
        const productId = (await params).productId;

        if (!productId) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Product ID is required",
                    status: 400,
                    data: null,
                },
                {
                    status: 400,
                },
            );
        }

        const productDetails = await prisma.product.findUnique({
            where: {
                product_id: productId,
            },
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
        });

        if (!productDetails) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Product not found",
                    status: 404,
                    data: null,
                },
                {
                    status: 404,
                },
            );
        }

        // Format product with CloudFront URLs
        const formattedProduct = {
            ...productDetails,
            images: productDetails.images.map((img) => ({
                id: img.id,
                image_url: `${config.cloudFrontUrl}/${img.image_url}`,
            })),
        };

        return NextResponse.json({
          error: false,
          message: "Product fetched successfully",
          status: 200,
          data: formattedProduct,
        });
    } catch (error: any) {
        console.error("Error fetching product details:", error);
        return NextResponse.json({
            error: true,
            message: "An error occurred while fetching product details",
            status: 500,
            data: null,
        });
    }
}
