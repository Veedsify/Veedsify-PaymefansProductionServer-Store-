// Store Product Types
export type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  instock: number;
  product_id: string;
  category: {
    name: string;
  };
  images: {
    id: number;
    image_url: string;
  }[];
  sizes: {
    size: {
      name: string;
      id: number;
    };
  }[];
};

export type StoreAllProductsResponse = {
  error: boolean;
  message: string;
  totalProducts: number;
  hasMore: boolean;
  perPage: number;
  data: StoreProduct[];
};

// Cart Types
export type CartItem = {
  id: number;
  product: StoreProduct;
  quantity: number;
  selectedSize?: string;
};

// Wishlist Types
export type WishlistItem = {
  id: number;
  product: StoreProduct;
};

// Order Types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  product: StoreProduct;
  quantity: number;
  size?: {
    name: string;
  };
  price: number;
};

export type Order = {
  id: number;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

// Checkout Types
export type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};
