import { NextResponse } from "next/server";
import { auth } from "@auth";
import WishlistService from "@/server/WishlistService";
import { config } from "@/utils/config";

export async function POST(request: Request) {
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

        const body = await request.json();
        const { productIds } = body;

        if (!Array.isArray(productIds)) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Invalid productIds format",
                },
                { status: 400 },
            );
        }

        const userId = Number(session.user.id);

        console.log(
            "Syncing wishlist for user:",
            userId,
            "with productIds:",
            productIds,
        );

        const result = await WishlistService.syncWishlist(userId, productIds);

        if (result.error) {
            return NextResponse.json(result, { status: 400 });
        }

        // Check if data exists and is an array
        if (!result.data || !Array.isArray(result.data)) {
            return NextResponse.json(
                {
                    error: false,
                    message: "Wishlist synced successfully",
                    data: [],
                },
                { status: 200 },
            );
        }

        // Format wishlist items with CloudFront URLs
        const formattedData = result.data.map((item: any) => ({
            id: item.id,
            product: {
                id: item.product.id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                instock: item.product.instock,
                product_id: item.product.product_id,
                category: {
                    name: item.product.category.name,
                },
                images: item.product.images.map((img: any) => ({
                    id: img.id,
                    image_url: `${config.cloudFrontUrl}/${img.image_url}`,
                })),
                sizes: item.product.sizes.map((s: any) => ({
                    size: {
                        id: s.size.id,
                        name: s.size.name,
                    },
                })),
            },
        }));

        return NextResponse.json(
            {
                error: false,
                message: "Wishlist synced successfully",
                data: formattedData,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error in POST /api/wishlist/sync:", error);
        return NextResponse.json(
            {
                error: true,
                message: error.message || "Failed to sync wishlist",
            },
            { status: 500 },
        );
    }
}
