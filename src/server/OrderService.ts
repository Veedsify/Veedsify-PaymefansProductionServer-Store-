import prisma from "prisma/prisma";
import crypto from "crypto";
import axios from "axios";
import { inngest } from "@/inngest/client";
import UserService from "./UserSevice";
import { calculateDeliveryFee } from "@/utils/nigerianStates";

interface CheckoutItem {
    product_id: string;
    quantity: number;
    size_id?: number;
}

interface ShippingAddress {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
}

interface CheckoutData {
    userId: number;
    items: CheckoutItem[];
    shipping_address: ShippingAddress;
    payment_method: "paystack";
}

interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data?: {
        status: string;
        reference: string;
        amount: number;
        customer: {
            email: string;
            customer_code: string;
        };
        paid_at: string;
    };
}

class OrderService {
    private static PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
    private static PAYSTACK_BASE_URL = "https://api.paystack.co";

    /**
     * Generate a unique order ID
     */
    private static generateOrderId(): string {
        const timestamp = Date.now().toString(36);
        const randomStr = crypto.randomBytes(4).toString("hex");
        return `ORD-${timestamp}-${randomStr}`.toUpperCase();
    }

    /**
     * Generate a unique payment reference
     */
    private static generatePaymentReference(): string {
        const timestamp = Date.now().toString(36);
        const randomStr = crypto.randomBytes(6).toString("hex");
        return `PMF-${timestamp}-${randomStr}`.toUpperCase();
    }

    /**
     * Validate checkout items and calculate total
     */
    private static async validateAndCalculateTotal(
        items: CheckoutItem[],
        shippingAddress?: ShippingAddress
    ): Promise<{
        isValid: boolean;
        message?: string;
        total: number;
        subtotal: number;
        tax: number;
        deliveryFee: number;
        validatedItems: any[];
    }> {
        try {
            if (!items || items.length === 0) {
                return {
                    isValid: false,
                    message: "Cart is empty",
                    total: 0,
                    subtotal: 0,
                    tax: 0,
                    deliveryFee: 0,
                    validatedItems: [],
                };
            }

            const validatedItems = [];
            let total = 0;

            for (const item of items) {
                // Fetch product details
                const product = await prisma.product.findUnique({
                    where: { product_id: item.product_id },
                    include: {
                        sizes: {
                            include: {
                                size: true,
                            },
                        },
                    },
                });

                if (!product) {
                    return {
                        isValid: false,
                        message: `Product ${item.product_id} not found`,
                        total: 0,
                        subtotal: 0,
                        tax: 0,
                        deliveryFee: 0,
                        validatedItems: [],
                    };
                }

                // Check stock availability
                if (product.instock < item.quantity) {
                    return {
                        isValid: false,
                        message: `Insufficient stock for ${product.name}. Available: ${product.instock}, Requested: ${item.quantity}`,
                        total: 0,
                        subtotal: 0,
                        tax: 0,
                        deliveryFee: 0,
                        validatedItems: [],
                    };
                }

                // Validate size if provided
                if (item.size_id) {
                    const sizeExists = product.sizes.some(
                        (s) => s.size_id === item.size_id
                    );
                    if (!sizeExists) {
                        return {
                            isValid: false,
                            message: `Invalid size for ${product.name}`,
                            total: 0,
                            subtotal: 0,
                            tax: 0,
                            deliveryFee: 0,
                            validatedItems: [],
                        };
                    }
                }

                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                validatedItems.push({
                    product,
                    quantity: item.quantity,
                    size_id: item.size_id,
                    price: product.price,
                    subtotal: itemTotal,
                });
            }

            // Calculate 7.5% tax on subtotal
            const taxRate = 0.075;
            const tax = total * taxRate;
            
            // Calculate delivery fee
            const deliveryFee = shippingAddress
                ? calculateDeliveryFee(shippingAddress.state, total)
                : 0;
            
            const totalWithTaxAndDelivery = total + tax + deliveryFee;

            return {
                isValid: true,
                total: totalWithTaxAndDelivery,
                subtotal: total,
                tax,
                deliveryFee,
                validatedItems,
            };
        } catch (error) {
            console.error("Error validating items:", error);
            return {
                isValid: false,
                message: "Failed to validate items",
                total: 0,
                subtotal: 0,
                tax: 0,
                deliveryFee: 0,
                validatedItems: [],
            };
        }
    }

    /**
     * Initialize payment with Paystack
     */
    private static async initializePaystackPayment(
        amount: number,
        email: string,
        reference: string,
        metadata?: any
    ): Promise<{
        error: boolean;
        message: string;
        data?: any;
    }> {
        try {
            const response = await axios.post<PaystackInitializeResponse>(
                `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
                {
                    email,
                    amount: Math.round(amount * 100), // Convert to kobo
                    reference,
                    metadata,
                    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
                    channels: ["card", "bank", "ussd", "qr", "mobile_money"],
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status) {
                return {
                    error: false,
                    message: "Payment initialized successfully",
                    data: response.data.data,
                };
            }

            return {
                error: true,
                message:
                    response.data.message || "Payment initialization failed",
            };
        } catch (error: any) {
            console.error(
                "Paystack initialization error:",
                error.response?.data || error.message
            );
            return {
                error: true,
                message:
                    error.response?.data?.message ||
                    "Failed to initialize payment",
            };
        }
    }

    /**
     * Verify payment with Paystack
     */
    private static async verifyPaystackPayment(reference: string): Promise<{
        error: boolean;
        message: string;
        data?: any;
    }> {
        try {
            const response = await axios.get<PaystackVerifyResponse>(
                `${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                    },
                }
            );

            if (
                response.data.status &&
                response.data.data?.status === "success"
            ) {
                return {
                    error: false,
                    message: "Payment verified successfully",
                    data: response.data.data,
                };
            }

            return {
                error: true,
                message:
                    "Payment verification failed or payment not successful",
                data: response.data.data,
            };
        } catch (error: any) {
            console.error(
                "Paystack verification error:",
                error.response?.data || error.message
            );
            return {
                error: true,
                message:
                    error.response?.data?.message || "Failed to verify payment",
            };
        }
    }

    /**
     * Process checkout and create order
     */
    static async processCheckout(checkoutData: CheckoutData) {
        try {
            const { userId, items, shipping_address, payment_method } =
                checkoutData;

            // Get user details
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, name: true },
            });

            if (!user) {
                return {
                    error: true,
                    message: "User not found",
                };
            }

            // Validate items and calculate total
            const validation = await this.validateAndCalculateTotal(
                items,
                shipping_address
            );
            if (!validation.isValid) {
                return {
                    error: true,
                    message: validation.message,
                };
            }

            const orderId = this.generateOrderId();
            const paymentReference = this.generatePaymentReference();

            // Store delivery fee in shipping address JSON for reference
            const shippingAddressWithDeliveryFee = {
                ...shipping_address,
                deliveryFee: validation.deliveryFee,
            };

            // Create order in database with pending status
            const order = await prisma.order.create({
                data: {
                    order_id: orderId,
                    user_id: userId,
                    total_amount: validation.total,
                    shipping_address: JSON.stringify(
                        shippingAddressWithDeliveryFee
                    ),
                    payment_reference: paymentReference,
                    payment_status: "pending",
                    status: "pending",
                    items: {
                        create: validation.validatedItems.map((item) => ({
                            product_id: item.product.product_id,
                            quantity: item.quantity,
                            price: item.price,
                            size_id: item.size_id || null,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // Initialize payment with payment provider
            let paymentData;
            if (payment_method === "paystack") {
                const paymentResult = await this.initializePaystackPayment(
                    validation.total,
                    user.email,
                    paymentReference,
                    {
                        order_id: orderId,
                        customer_name: user.name,
                        items_count: items.length,
                    }
                );

                if (paymentResult.error) {
                    // Delete order if payment initialization fails
                    await prisma.order.delete({ where: { id: order.id } });
                    return {
                        error: true,
                        message: paymentResult.message,
                    };
                }

                paymentData = paymentResult.data;
            }

            return {
                error: false,
                message: "Order created successfully",
                data: {
                    order_id: orderId,
                    reference: paymentReference,
                    payment_url: paymentData?.authorization_url,
                    access_code: paymentData?.access_code,
                    total_amount: validation.total,
                    subtotal: validation.subtotal,
                    tax: validation.tax,
                    deliveryFee: validation.deliveryFee,
                },
            };
        } catch (error: any) {
            console.error("Checkout error:", error);
            return {
                error: true,
                message: "Failed to process checkout",
            };
        }
    }

    /**
     * Verify payment and update order
     */
    static async verifyPayment(reference: string, userId: number) {
        try {
          const user = await UserService.getUserById(userId);

          if (!user) {
            return {
              error: true,
              message: "User doesn't exists",
              data: null,
            };
          }

          // Find order with this reference
          const order = await prisma.order.findFirst({
            where: {
              payment_reference: reference,
              user_id: userId,
            },
            include: {
              items: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                  size: true,
                },
              },
            },
          });

          if (!order) {
            return {
              error: true,
              message: "Order not found",
            };
          }

          // Check if already verified
          if (order.payment_status === "paid") {
            return {
              error: false,
              message: "Payment already verified",
              data: {
                order_id: order.order_id,
                status: order.status,
                order,
              },
            };
          }

          // Verify with payment provider
          const verificationResult =
            await this.verifyPaystackPayment(reference);

          if (verificationResult.error) {
            // Update order status to failed
            await prisma.order.update({
              where: { id: order.id },
              data: {
                payment_status: "failed",
                status: "cancelled",
              },
            });

            return {
              error: true,
              message: verificationResult.message,
            };
          }

          // Update order status to paid and processing
          // Use transaction to ensure all updates succeed or fail together
          const updatedOrder = await prisma.$transaction(async (tx) => {
            // Update order status
            const updated = await tx.order.update({
              where: { id: order.id },
              data: {
                payment_status: "paid",
                status: "processing",
              },
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    username: true,
                  },
                },
                items: {
                  include: {
                    product: {
                      include: {
                        images: true,
                      },
                    },
                    size: true,
                  },
                },
              },
            });

            // Update product stock
            for (const item of order.items) {
              await tx.product.update({
                where: { product_id: item.product_id },
                data: {
                  instock: {
                    decrement: item.quantity,
                  },
                },
              });
            }

            // Clear user's cart
            await tx.cart.deleteMany({
              where: { user_id: userId },
            });

            return updated;
          });

          // Prepare return data first (before email sending)
          const returnData = {
            error: false,
            message: "Payment verified successfully",
            data: {
              order_id: updatedOrder.order_id,
              status: updatedOrder.status,
              order: updatedOrder,
            },
          };

          // Send order confirmation email (non-blocking)
          if (updatedOrder.user?.email) {
            try {
              let shippingAddress = undefined;
              try {
                shippingAddress =
                  typeof updatedOrder.shipping_address === "string"
                    ? JSON.parse(updatedOrder.shipping_address)
                    : updatedOrder.shipping_address;
              } catch (parseError) {
                console.error("Failed to parse shipping address:", parseError);
                // Continue without shipping address in email
              }

              // Safely map items, handling missing product data
              const emailItems = updatedOrder.items
                .filter((item) => item.product) // Only include items with product data
                .map((item) => ({
                  product: {
                    name: item.product?.name || "Unknown Product",
                    images: item.product?.images || [],
                  },
                  quantity: item.quantity,
                  price: item.price,
                  size: item.size || null,
                }));

              // Only send email if we have valid items
              if (emailItems.length > 0) {
                // Ensure deliveryFee is included in shippingAddress for email
                const emailShippingAddress = shippingAddress
                  ? {
                      ...shippingAddress,
                      deliveryFee:
                        shippingAddress.deliveryFee ||
                        (typeof updatedOrder.shipping_address === "string"
                          ? JSON.parse(updatedOrder.shipping_address)
                          : updatedOrder.shipping_address)?.deliveryFee ||
                        0,
                    }
                  : undefined;

                await inngest.send({
                  name: "orders/confirmation.send",
                  data: {
                    email: updatedOrder.user.email,
                    name:
                      updatedOrder.user.name ||
                      updatedOrder.user.username ||
                      "there",
                    orderId: updatedOrder.order_id,
                    orderDate: new Date(
                      updatedOrder.created_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                    items: emailItems,
                    totalAmount: updatedOrder.total_amount,
                    shippingAddress: emailShippingAddress,
                  },
                });
              } else {
                console.warn(
                  "Skipping order confirmation email: No valid items found"
                );
              }
            } catch (error) {
              console.error("Failed to queue order confirmation email:", error);
              // Don't fail the payment verification if email queueing fails
            }
          }

          return returnData;
        } catch (error: any) {
            console.error("Payment verification error:", error);
            console.error("Error details:", {
              reference,
              userId,
              errorMessage: error?.message,
              errorStack: error?.stack,
            });
            return {
              error: true,
              message:
                error?.message ||
                "Failed to verify payment. Please contact support with your order reference.",
            };
        }
    }

    /**
     * Get order by ID
     */
    static async getOrder(orderId: string, userId: number) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    order_id: orderId,
                    user_id: userId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    images: true,
                                    category: true,
                                },
                            },
                            size: true,
                        },
                    },
                },
            });

            if (!order) {
                return {
                    error: true,
                    message: "Order not found",
                };
            }

            return {
                error: false,
                message: "Order retrieved successfully",
                data: {
                    ...order,
                    shipping_address: JSON.parse(
                        order.shipping_address as string
                    ),
                },
            };
        } catch (error) {
            console.error("Error fetching order:", error);
            return {
                error: true,
                message: "Failed to retrieve order",
            };
        }
    }

    /**
     * Get all orders for a user
     */
    static async getUserOrders(userId: number) {
        try {
            const orders = await prisma.order.findMany({
                where: { user_id: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    images: true,
                                },
                            },
                            size: true,
                        },
                    },
                },
                orderBy: { created_at: "desc" },
            });

            const formattedOrders = orders.map((order) => ({
              ...order,
              shipping_address: order.shipping_address,
            }));

            return {
                error: false,
                message: "Orders retrieved successfully",
                data: formattedOrders,
            };
        } catch (error) {
            console.error("Error fetching orders:", error);
            return {
                error: true,
                message: "Failed to retrieve orders",
            };
        }
    }

    /**
     * Update order status
     */
    static async updateOrderStatus(
        orderId: string,
        userId: number,
        status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    ) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    order_id: orderId,
                    user_id: userId,
                },
            });

            if (!order) {
                return {
                    error: true,
                    message: "Order not found",
                };
            }

            // Don't allow status update if payment is not successful
            if (order.payment_status !== "paid") {
                return {
                    error: true,
                    message:
                        "Cannot update order status. Payment not completed",
                };
            }

            const updatedOrder = await prisma.order.update({
                where: { id: order.id },
                data: { status },
                include: {
                    items: {
                        include: {
                            product: true,
                            size: true,
                        },
                    },
                },
            });

            return {
                error: false,
                message: "Order status updated successfully",
                data: updatedOrder,
            };
        } catch (error) {
            console.error("Error updating order status:", error);
            return {
                error: true,
                message: "Failed to update order status",
            };
        }
    }

    /**
     * Cancel order (only if payment is pending or failed)
     */
    static async cancelOrder(orderId: string, userId: number) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    order_id: orderId,
                    user_id: userId,
                },
            });

            if (!order) {
                return {
                    error: true,
                    message: "Order not found",
                };
            }

            // Only allow cancellation if payment is pending or failed
            if (order.payment_status === "paid") {
                return {
                    error: true,
                    message:
                        "Cannot cancel paid orders. Please contact support",
                };
            }

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "cancelled",
                },
            });

            return {
                error: false,
                message: "Order cancelled successfully",
            };
        } catch (error) {
            console.error("Error cancelling order:", error);
            return {
                error: true,
                message: "Failed to cancel order",
            };
        }
    }

    /**
     * Webhook handler for Paystack
     */
    static async handlePaystackWebhook(payload: any, signature: string) {
        try {
            // Verify webhook signature
            const hash = crypto
                .createHmac("sha512", this.PAYSTACK_SECRET_KEY)
                .update(JSON.stringify(payload))
                .digest("hex");

            if (hash !== signature) {
                return {
                    error: true,
                    message: "Invalid signature",
                };
            }

            const { event, data } = payload;

            if (event === "charge.success") {
                const reference = data.reference;
                const order = await prisma.order.findFirst({
                  where: { payment_reference: reference },
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        username: true,
                      },
                    },
                    items: {
                      include: {
                        product: {
                          include: {
                            images: true,
                          },
                        },
                        size: true,
                      },
                    },
                  },
                });

                if (!order) {
                    return {
                        error: true,
                        message: "Order not found",
                    };
                }

                // Update order if not already updated
                if (order.payment_status !== "paid") {
                  // Use transaction to ensure all updates succeed or fail together
                  const updatedOrder = await prisma.$transaction(async (tx) => {
                    // Update order status
                    const updated = await tx.order.update({
                      where: { id: order.id },
                      data: {
                        payment_status: "paid",
                        status: "processing",
                      },
                      include: {
                        user: {
                          select: {
                            name: true,
                            email: true,
                            username: true,
                          },
                        },
                        items: {
                          include: {
                            product: {
                              include: {
                                images: true,
                              },
                            },
                            size: true,
                          },
                        },
                      },
                    });

                    // Update product stock
                    for (const item of order.items) {
                      await tx.product.update({
                        where: { product_id: item.product_id },
                        data: {
                          instock: {
                            decrement: item.quantity,
                          },
                        },
                      });
                    }

                    // Clear user's cart
                    await tx.cart.deleteMany({
                      where: { user_id: order.user_id },
                    });

                    return updated;
                  });

                  // Send order confirmation email (non-blocking)
                  if (updatedOrder.user?.email) {
                    try {
                      let shippingAddress = undefined;
                      try {
                        shippingAddress =
                          typeof updatedOrder.shipping_address === "string"
                            ? JSON.parse(updatedOrder.shipping_address)
                            : updatedOrder.shipping_address;
                      } catch (parseError) {
                        console.error(
                          "Failed to parse shipping address:",
                          parseError
                        );
                        // Continue without shipping address in email
                      }

                      // Safely map items, handling missing product data
                      const emailItems = updatedOrder.items
                        .filter((item) => item.product) // Only include items with product data
                        .map((item) => ({
                          product: {
                            name: item.product?.name || "Unknown Product",
                            images: item.product?.images || [],
                          },
                          quantity: item.quantity,
                          price: item.price,
                          size: item.size || null,
                        }));

                      // Only send email if we have valid items
                      if (emailItems.length > 0) {
                        // Ensure deliveryFee is included in shippingAddress for email
                        const emailShippingAddress = shippingAddress
                          ? {
                              ...shippingAddress,
                              deliveryFee:
                                shippingAddress.deliveryFee ||
                                (typeof updatedOrder.shipping_address === "string"
                                  ? JSON.parse(updatedOrder.shipping_address)
                                  : updatedOrder.shipping_address)?.deliveryFee ||
                                0,
                            }
                          : undefined;

                        await inngest.send({
                          name: "orders/confirmation.send",
                          data: {
                            email: updatedOrder.user.email,
                            name:
                              updatedOrder.user.name ||
                              updatedOrder.user.username ||
                              "there",
                            orderId: updatedOrder.order_id,
                            orderDate: new Date(
                              updatedOrder.created_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }),
                            items: emailItems,
                            totalAmount: updatedOrder.total_amount,
                            shippingAddress: emailShippingAddress,
                          },
                        });
                      } else {
                        console.warn(
                          "Skipping order confirmation email: No valid items found"
                        );
                      }
                    } catch (error) {
                      console.error(
                        "Failed to queue order confirmation email:",
                        error
                      );
                      // Don't fail the webhook if email queueing fails
                    }
                  }
                }

                return {
                    error: false,
                    message: "Webhook processed successfully",
                };
            }

            return {
                error: false,
                message: "Event not handled",
            };
        } catch (error) {
            console.error("Webhook handling error:", error);
            return {
                error: true,
                message: "Failed to process webhook",
            };
        }
    }
}

export default OrderService;
