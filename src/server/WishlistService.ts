import prisma from "prisma/prisma";

interface AddToWishlistProps {
    userId: number;
    productId: number;
}

interface RemoveFromWishlistProps {
    userId: number;
    wishlistItemId: number;
}

class WishlistService {
    static async getWishlist(userId: number) {
        try {
            if (!userId || typeof userId !== "number") {
                return {
                    error: true,
                    message: "Invalid user id",
                };
            }

            const wishlistItems = await prisma.wishList.findMany({
                where: { user_id: userId },
                include: {
                    product: {
                        include: {
                            images: true,
                            category: true,
                            sizes: {
                                include: {
                                    size: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { created_at: "desc" },
            });

            return {
                error: false,
                message: "Wishlist retrieved successfully",
                data: wishlistItems,
            };
        } catch (error) {
            console.error("Error retrieving wishlist:", error);
            return {
                error: true,
                message: "Failed to retrieve wishlist",
            };
        }
    }

    static async addToWishlist(wishlistData: AddToWishlistProps) {
        try {
            const { userId, productId } = wishlistData;

            if (!userId || !productId) {
                return {
                    error: true,
                    message: "Missing required fields",
                };
            }

            // Check if item already exists in wishlist
            const existingItem = await prisma.wishList.findFirst({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });

            if (existingItem) {
                return {
                    error: true,
                    message: "Item already in wishlist",
                };
            }

            // Create new wishlist item
            const newWishlistItem = await prisma.wishList.create({
                data: {
                    user_id: userId,
                    product_id: productId,
                },
                include: {
                    product: {
                        include: {
                            images: true,
                            category: true,
                            sizes: {
                                include: {
                                    size: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                error: false,
                message: "Item added to wishlist",
                data: newWishlistItem,
            };
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            return {
                error: true,
                message: "Failed to add item to wishlist",
            };
        }
    }

    static async removeFromWishlist(removeData: RemoveFromWishlistProps) {
        try {
            const { userId, wishlistItemId } = removeData;

            if (!userId || !wishlistItemId) {
                return {
                    error: true,
                    message: "Missing required fields",
                };
            }

            // Verify the wishlist item belongs to the user
            const wishlistItem = await prisma.wishList.findFirst({
                where: {
                    id: wishlistItemId,
                    user_id: userId,
                },
            });

            if (!wishlistItem) {
                return {
                    error: true,
                    message: "Wishlist item not found",
                };
            }

            await prisma.wishList.delete({
                where: { id: wishlistItemId },
            });

            return {
                error: false,
                message: "Item removed from wishlist",
            };
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return {
                error: true,
                message: "Failed to remove item from wishlist",
            };
        }
    }

    static async removeByProductId(userId: number, productId: number) {
        try {
            if (!userId || !productId) {
                return {
                    error: true,
                    message: "Missing required fields",
                };
            }

            // Find and delete the wishlist item
            const wishlistItem = await prisma.wishList.findFirst({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });

            if (!wishlistItem) {
                return {
                    error: true,
                    message: "Wishlist item not found",
                };
            }

            await prisma.wishList.delete({
                where: { id: wishlistItem.id },
            });

            return {
                error: false,
                message: "Item removed from wishlist",
            };
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return {
                error: true,
                message: "Failed to remove item from wishlist",
            };
        }
    }

    static async clearWishlist(userId: number) {
        try {
            if (!userId || typeof userId !== "number") {
                return {
                    error: true,
                    message: "Invalid user id",
                };
            }

            await prisma.wishList.deleteMany({
                where: { user_id: userId },
            });

            return {
                error: false,
                message: "Wishlist cleared successfully",
            };
        } catch (error) {
            console.error("Error clearing wishlist:", error);
            return {
                error: true,
                message: "Failed to clear wishlist",
            };
        }
    }

    static async syncWishlist(userId: number, productIds: number[]) {
        try {
            if (!userId || typeof userId !== "number") {
                return {
                    error: true,
                    message: "Invalid user id",
                };
            }

            // Get existing wishlist items
            const existingItems = await prisma.wishList.findMany({
                where: { user_id: userId },
            });

            const existingProductIds = new Set(
                existingItems.map((item) => item.product_id)
            );

            const operations = [];

            // Add new items that don't exist in the database
            for (const productId of productIds) {
                if (!existingProductIds.has(productId)) {
                    operations.push(
                        prisma.wishList.create({
                            data: {
                                user_id: userId,
                                product_id: productId,
                            },
                        })
                    );
                }
            }

            // Remove items from database that are not in the client list
            const productIdsSet = new Set(productIds);
            for (const existingItem of existingItems) {
                if (!productIdsSet.has(existingItem.product_id)) {
                    operations.push(
                        prisma.wishList.delete({
                            where: { id: existingItem.id },
                        })
                    );
                }
            }

            // Execute all operations
            if (operations.length > 0) {
                await prisma.$transaction(operations);
            }

            // Get updated wishlist
            const updatedWishlist = await this.getWishlist(userId);

            return updatedWishlist;
        } catch (error) {
            console.error("Error syncing wishlist:", error);
            return {
                error: true,
                message: "Failed to sync wishlist",
            };
        }
    }

    static async isInWishlist(userId: number, productId: number) {
        try {
            if (!userId || !productId) {
                return {
                    error: true,
                    message: "Missing required fields",
                };
            }

            const item = await prisma.wishList.findFirst({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });

            return {
                error: false,
                data: !!item,
            };
        } catch (error) {
            console.error("Error checking wishlist:", error);
            return {
                error: true,
                message: "Failed to check wishlist",
            };
        }
    }
}

export default WishlistService;
