import type { StoreProduct, Order, OrderStatus } from "@/types";

export const mockProducts: StoreProduct[] = [
  {
    id: 1,
    product_id: "prod_001",
    name: "Premium T-Shirt",
    description:
      "High-quality cotton t-shirt with modern design. Perfect for everyday wear.",
    price: 2500,
    instock: 50,
    category: {
      name: "Clothing",
    },
    images: [
      {
        id: 1,
        image_url:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=480&h=640&fit=crop",
      },
      {
        id: 2,
        image_url:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "S" } },
      { size: { name: "M" } },
      { size: { name: "L" } },
      { size: { name: "XL" } },
    ],
  },
  {
    id: 2,
    product_id: "prod_002",
    name: "Designer Hoodie",
    description:
      "Comfortable hoodie with unique prints. Stay warm and stylish.",
    price: 5500,
    instock: 30,
    category: {
      name: "Clothing",
    },
    images: [
      {
        id: 3,
        image_url:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "M" } },
      { size: { name: "L" } },
      { size: { name: "XL" } },
    ],
  },
  {
    id: 3,
    product_id: "prod_003",
    name: "Luxury Watch",
    description:
      "Elegant timepiece with premium craftsmanship. A statement of style.",
    price: 15000,
    instock: 15,
    category: {
      name: "Accessories",
    },
    images: [
      {
        id: 4,
        image_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=480&h=640&fit=crop",
      },
      {
        id: 5,
        image_url:
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 4,
    product_id: "prod_004",
    name: "Stylish Sneakers",
    description:
      "Modern sneakers designed for comfort and style. Perfect for any occasion.",
    price: 8500,
    instock: 40,
    category: {
      name: "Footwear",
    },
    images: [
      {
        id: 6,
        image_url:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "40" } },
      { size: { name: "41" } },
      { size: { name: "42" } },
      { size: { name: "43" } },
      { size: { name: "44" } },
    ],
  },
  {
    id: 5,
    product_id: "prod_005",
    name: "Leather Backpack",
    description:
      "Premium leather backpack with multiple compartments. Perfect for work or travel.",
    price: 12000,
    instock: 20,
    category: {
      name: "Accessories",
    },
    images: [
      {
        id: 7,
        image_url:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 6,
    product_id: "prod_006",
    name: "Denim Jacket",
    description:
      "Classic denim jacket with vintage wash. A timeless wardrobe essential.",
    price: 6500,
    instock: 25,
    category: {
      name: "Clothing",
    },
    images: [
      {
        id: 8,
        image_url:
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "S" } },
      { size: { name: "M" } },
      { size: { name: "L" } },
      { size: { name: "XL" } },
    ],
  },
  {
    id: 7,
    product_id: "prod_007",
    name: "Wireless Earbuds",
    description:
      "High-quality wireless earbuds with noise cancellation. Crystal clear sound.",
    price: 9500,
    instock: 35,
    category: {
      name: "Electronics",
    },
    images: [
      {
        id: 9,
        image_url:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 8,
    product_id: "prod_008",
    name: "Sunglasses",
    description:
      "UV protection sunglasses with stylish frames. Perfect for sunny days.",
    price: 3500,
    instock: 45,
    category: {
      name: "Accessories",
    },
    images: [
      {
        id: 10,
        image_url:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 9,
    product_id: "prod_009",
    name: "Casual Shorts",
    description:
      "Comfortable casual shorts for summer days. Lightweight and breathable.",
    price: 3000,
    instock: 60,
    category: {
      name: "Clothing",
    },
    images: [
      {
        id: 11,
        image_url:
          "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "S" } },
      { size: { name: "M" } },
      { size: { name: "L" } },
      { size: { name: "XL" } },
    ],
  },
  {
    id: 10,
    product_id: "prod_010",
    name: "Baseball Cap",
    description:
      "Adjustable baseball cap with embroidered logo. Classic style.",
    price: 2000,
    instock: 70,
    category: {
      name: "Accessories",
    },
    images: [
      {
        id: 12,
        image_url:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 11,
    product_id: "prod_011",
    name: "Running Shoes",
    description:
      "Professional running shoes with cushioned sole. Built for performance.",
    price: 11000,
    instock: 28,
    category: {
      name: "Footwear",
    },
    images: [
      {
        id: 13,
        image_url:
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "40" } },
      { size: { name: "41" } },
      { size: { name: "42" } },
      { size: { name: "43" } },
      { size: { name: "44" } },
    ],
  },
  {
    id: 12,
    product_id: "prod_012",
    name: "Yoga Mat",
    description:
      "Non-slip yoga mat with carrying strap. Perfect for home workouts.",
    price: 4500,
    instock: 50,
    category: {
      name: "Fitness",
    },
    images: [
      {
        id: 14,
        image_url:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 13,
    product_id: "prod_013",
    name: "Water Bottle",
    description:
      "Insulated water bottle keeps drinks cold for 24 hours. BPA-free.",
    price: 2500,
    instock: 80,
    category: {
      name: "Fitness",
    },
    images: [
      {
        id: 15,
        image_url:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
  {
    id: 14,
    product_id: "prod_014",
    name: "Polo Shirt",
    description:
      "Classic polo shirt with elegant design. Perfect for smart casual wear.",
    price: 4000,
    instock: 42,
    category: {
      name: "Clothing",
    },
    images: [
      {
        id: 16,
        image_url:
          "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=480&h=640&fit=crop",
      },
    ],
    sizes: [
      { size: { name: "S" } },
      { size: { name: "M" } },
      { size: { name: "L" } },
      { size: { name: "XL" } },
    ],
  },
  {
    id: 15,
    product_id: "prod_015",
    name: "Laptop Sleeve",
    description:
      "Protective laptop sleeve with soft interior. Fits up to 15-inch laptops.",
    price: 3500,
    instock: 55,
    category: {
      name: "Accessories",
    },
    images: [
      {
        id: 17,
        image_url:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=480&h=640&fit=crop",
      },
    ],
    sizes: [],
  },
];

// Helper function to get paginated products
export const getPaginatedProducts = (
  page: number = 1,
  perPage: number = 12
) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = mockProducts.slice(startIndex, endIndex);

  return {
    error: false,
    message: "Products fetched successfully",
    totalProducts: mockProducts.length,
    hasMore: endIndex < mockProducts.length,
    perPage,
    data: paginatedData,
  };
};

// Helper function to get product by ID
export const getProductById = (productId: string): StoreProduct | undefined => {
  return mockProducts.find((product) => product.product_id === productId);
};

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 1,
    orderId: "ORD-2025-001",
    items: [
      {
        id: 1,
        product: mockProducts[0],
        quantity: 2,
        size: "M",
        price: mockProducts[0].price,
      },
      {
        id: 2,
        product: mockProducts[3],
        quantity: 1,
        size: "42",
        price: mockProducts[3].price,
      },
    ],
    total: mockProducts[0].price * 2 + mockProducts[3].price,
    status: "delivered",
    createdAt: "2025-11-01T10:30:00Z",
    shippingAddress: {
      fullName: "John Doe",
      phone: "+234 801 234 5678",
      address: "123 Main Street",
      city: "Lagos",
      state: "Lagos",
      zipCode: "100001",
    },
  },
  {
    id: 2,
    orderId: "ORD-2025-002",
    items: [
      {
        id: 3,
        product: mockProducts[2],
        quantity: 1,
        price: mockProducts[2].price,
      },
    ],
    total: mockProducts[2].price,
    status: "processing",
    createdAt: "2025-11-08T14:20:00Z",
    shippingAddress: {
      fullName: "Jane Smith",
      phone: "+234 802 345 6789",
      address: "456 Oak Avenue",
      city: "Abuja",
      state: "FCT",
      zipCode: "900001",
    },
  },
  {
    id: 3,
    orderId: "ORD-2025-003",
    items: [
      {
        id: 4,
        product: mockProducts[6],
        quantity: 1,
        price: mockProducts[6].price,
      },
      {
        id: 5,
        product: mockProducts[7],
        quantity: 2,
        price: mockProducts[7].price,
      },
    ],
    total: mockProducts[6].price + mockProducts[7].price * 2,
    status: "shipped",
    createdAt: "2025-11-10T09:15:00Z",
    shippingAddress: {
      fullName: "Michael Johnson",
      phone: "+234 803 456 7890",
      address: "789 Pine Road",
      city: "Port Harcourt",
      state: "Rivers",
      zipCode: "500001",
    },
  },
];
