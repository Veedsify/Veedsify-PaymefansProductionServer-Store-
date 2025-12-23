import prisma from "prisma/prisma";

interface AddToCartProps {
  userId: number;
  productId: number;
  quantity: number;
  sizeId: number;
}

interface UpdateCartItemProps {
  userId: number;
  cartItemId: number;
  quantity: number;
}

interface RemoveFromCartProps {
  userId: number;
  cartItemId: number;
}

class CartService {
  static async getCart(userId: number) {
    try {
      if (!userId || typeof userId !== "number") {
        return {
          error: true,
          message: "Invalid user id",
        };
      }

      const cartItems = await prisma.cart.findMany({
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
          size: true,
        },
        orderBy: { created_at: "desc" },
      });

      return {
        error: false,
        message: "Cart retrieved successfully",
        data: cartItems,
      };
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return {
        error: true,
        message: "Failed to retrieve cart",
      };
    }
  }

  static async addToCart(cartData: AddToCartProps) {
    try {
      const { userId, productId, quantity, sizeId } = cartData;

      if (!userId || !productId || !quantity || !sizeId) {
        return {
          error: true,
          message: "Missing required fields",
        };
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cart.findFirst({
        where: {
          user_id: userId,
          product_id: productId,
          size_id: sizeId,
        },
      });

      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await prisma.cart.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
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
            size: true,
          },
        });

        return {
          error: false,
          message: "Cart item quantity updated",
          data: updatedItem,
        };
      }

      // Create new cart item
      const newCartItem = await prisma.cart.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity,
          size_id: sizeId,
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
          size: true,
        },
      });

      return {
        error: false,
        message: "Item added to cart",
        data: newCartItem,
      };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return {
        error: true,
        message: "Failed to add item to cart",
      };
    }
  }

  static async updateCartItem(updateData: UpdateCartItemProps) {
    try {
      const { userId, cartItemId, quantity } = updateData;

      if (!userId || !cartItemId || quantity === undefined) {
        return {
          error: true,
          message: "Missing required fields",
        };
      }

      // Verify the cart item belongs to the user
      const cartItem = await prisma.cart.findFirst({
        where: {
          id: cartItemId,
          user_id: userId,
        },
      });

      if (!cartItem) {
        return {
          error: true,
          message: "Cart item not found",
        };
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await prisma.cart.delete({
          where: { id: cartItemId },
        });

        return {
          error: false,
          message: "Item removed from cart",
          data: null,
        };
      }

      // Update quantity
      const updatedItem = await prisma.cart.update({
        where: { id: cartItemId },
        data: { quantity },
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
          size: true,
        },
      });

      return {
        error: false,
        message: "Cart item updated",
        data: updatedItem,
      };
    } catch (error) {
      console.error("Error updating cart item:", error);
      return {
        error: true,
        message: "Failed to update cart item",
      };
    }
  }

  static async removeFromCart(removeData: RemoveFromCartProps) {
    try {
      const { userId, cartItemId } = removeData;

      if (!userId || !cartItemId) {
        return {
          error: true,
          message: "Missing required fields",
        };
      }

      // Verify the cart item belongs to the user
      const cartItem = await prisma.cart.findFirst({
        where: {
          id: cartItemId,
          user_id: userId,
        },
      });

      if (!cartItem) {
        return {
          error: true,
          message: "Cart item not found",
        };
      }

      await prisma.cart.delete({
        where: { id: cartItemId },
      });

      return {
        error: false,
        message: "Item removed from cart",
      };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return {
        error: true,
        message: "Failed to remove item from cart",
      };
    }
  }

  static async clearCart(userId: number) {
    try {
      if (!userId || typeof userId !== "number") {
        return {
          error: true,
          message: "Invalid user id",
        };
      }

      await prisma.cart.deleteMany({
        where: { user_id: userId },
      });

      return {
        error: false,
        message: "Cart cleared successfully",
      };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return {
        error: true,
        message: "Failed to clear cart",
      };
    }
  }

  static async syncCart(userId: number, cartItems: any[]) {
    try {
      if (!userId || typeof userId !== "number") {
        return {
          error: true,
          message: "Invalid user id",
        };
      }

      // Get existing cart items
      const existingItems = await prisma.cart.findMany({
        where: { user_id: userId },
      });

      // Create a map of existing items for quick lookup
      const existingItemsMap = new Map(
        existingItems.map((item) => [
          `${item.product_id}-${item.size_id}`,
          item,
        ]),
      );

      const operations = [];

      // Process each item from the client
      for (const item of cartItems) {
        const key = `${item.product.id}-${item.sizeId}`;
        const existingItem = existingItemsMap.get(key);

        if (existingItem) {
          // Update existing item with the maximum quantity
          if (existingItem.quantity !== item.quantity) {
            operations.push(
              prisma.cart.update({
                where: { id: existingItem.id },
                data: { quantity: item.quantity },
              }),
            );
          }
          existingItemsMap.delete(key);
        } else {
          // Add new item
          operations.push(
            prisma.cart.create({
              data: {
                user_id: userId,
                product_id: item.product.id,
                quantity: item.quantity,
                size_id: item.sizeId,
              },
            }),
          );
        }
      }

      // Execute all operations
      if (operations.length > 0) {
        await prisma.$transaction(operations);
      }

      // Get updated cart
      const updatedCart = await this.getCart(userId);

      return updatedCart;
    } catch (error) {
      console.error("Error syncing cart:", error);
      return {
        error: true,
        message: "Failed to sync cart",
      };
    }
  }
}

export default CartService;
