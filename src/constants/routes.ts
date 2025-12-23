/**
 * An object containing various API route endpoints for the store application.
 * All routes now use Next.js API routes instead of external server.
 */
const ROUTE = {
  /**
   * Endpoint for fetching all products from the store.
   * @param {number} page - The page number
   * @returns {string} The URL to fetch store products
   */
  FETCH_STORE_PRODUCTS: (page: number) => `/api/store/products?page=${page}`,

  /**
   * Endpoint for fetching a specific product from the store by ID.
   * @param {string} product_id - The product ID
   * @returns {string} The URL to fetch the product
   */
  FETCH_PRODUCT: (product_id: string) => `/api/store/products/${product_id}`,

  /**
   * Endpoint for store checkout
   * @type {string}
   */
  STORE_CHECKOUT: `/api/checkout`,

  /**
   * Endpoint for verifying payment
   * @param {string} reference - The payment reference
   * @returns {string} The URL to verify payment
   */
  VERIFY_PAYMENT: (reference: string) => `/api/payment/verify/${reference}`,

  /**
   * Endpoint for fetching user orders
   * @type {string}
   */
  GET_USER_ORDERS: `/api/orders`,

  /**
   * Endpoint for fetching a specific order by ID
   * @param {string} order_id - The order ID
   * @returns {string} The URL to fetch the order
   */
  GET_ORDER: (order_id: string) => `/api/orders/${order_id}`,

  /**
   * Endpoint for updating order status
   * @param {string} order_id - The order ID
   * @returns {string} The URL to update order status
   */
  UPDATE_ORDER_STATUS: (order_id: string) => `/api/orders/${order_id}`,

  /**
   * Endpoint for adding product to wishlist
   * @type {string}
   */
  WISHLIST_ADD: `/api/wishlist`,

  /**
   * Endpoint for removing product from wishlist
   * @param {string} product_id - The product ID
   * @returns {string} The URL to remove product from wishlist
   */
  WISHLIST_REMOVE: (product_id: string) => `/api/wishlist/${product_id}`,

  /**
   * Endpoint for fetching user's wishlist
   * @type {string}
   */
  WISHLIST_GET: `/api/wishlist`,

  /**
   * Endpoint for checking if product is in wishlist
   * @param {string} product_id - The product ID
   * @returns {string} The URL to check wishlist status
   */
  WISHLIST_CHECK: (product_id: string) => `/api/wishlist/check/${product_id}`,

  /**
   * Endpoint for getting wishlist count
   * @type {string}
   */
  WISHLIST_COUNT: `/api/wishlist/count`,

  /**
   * Endpoint for clearing entire wishlist
   * @type {string}
   */
  WISHLIST_CLEAR: `/api/wishlist`,

  /**
   * Endpoint for fetching store categories
   * @type {string}
   */
  GET_CATEGORIES: `/api/store/categories`,

  /**
   * Endpoint for fetching products by category
   * @param {string} category_id - The category ID
   * @param {number} page - The page number
   * @returns {string} The URL to fetch products by category
   */
  GET_PRODUCTS_BY_CATEGORY: (category_id: string, page: number) =>
    `/api/store/categories/${category_id}/products?page=${page}`,

  /**
   * Endpoint for fetching outer pages by slug
   * @param {string} slug - The page slug
   * @returns {string} The URL to fetch the page
   */
  GET_PAGE: (slug: string) => `/api/pages/${slug}`,
};

export default ROUTE;
