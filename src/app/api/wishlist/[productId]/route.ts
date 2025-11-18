import { NextResponse } from "next/server";
import { auth } from "@auth";
import WishlistService from "@/server/WishlistService";

export async function DELETE(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const userId = Number(session.user.id);
        const productId = Number(params.productId);

        const result = await WishlistService.removeByProductId(
            userId,
            productId
        );

        if (result.error) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE /api/wishlist/[productId]:", error);
        return NextResponse.json(
            {
                error: true,
                message: "Failed to remove item from wishlist",
            },
            { status: 500 }
        );
    }
}
