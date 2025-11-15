const fmt = (format: string, ...args: any[]): string => {
  let index = 0;
  return format.replace(/%s/g, () => String(args[index++]));
};

const NEXT_PUBLIC_TS_EXPRESS_URL = process.env.NEXT_PUBLIC_TS_EXPRESS_URL;

/**
 * An object containing various API route endpoints for the store application.
 */
const ROUTE = {
  /**
   * Endpoint for fetching all products from the store.
   * @param {number} page - The page number
   * @returns {string} The URL to fetch store products
   */
  FETCH_STORE_PRODUCTS: (page: number) =>
    fmt(`%s/store/products?page=%s`, NEXT_PUBLIC_TS_EXPRESS_URL, page),

  /**
   * Endpoint for fetching a specific product from the store by ID.
   * @param {string} product_id - The product ID
   * @returns {string} The URL to fetch the product
   */
  FETCH_PRODUCT: (product_id: string) =>
    fmt(`%s/store/product/%s`, NEXT_PUBLIC_TS_EXPRESS_URL, product_id),

  /**
   * Endpoint for store checkout
   * @type {string}
   */
  STORE_CHECKOUT: fmt(`%s/store/checkout`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for verifying payment
   * @param {string} reference - The payment reference
   * @returns {string} The URL to verify payment
   */
  VERIFY_PAYMENT: (reference: string) =>
    fmt(`%s/store/verify-payment/%s`, NEXT_PUBLIC_TS_EXPRESS_URL, reference),

  /**
   * Endpoint for fetching user orders
   * @type {string}
   */
  GET_USER_ORDERS: fmt(`%s/store/orders`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for fetching a specific order by ID
   * @param {string} order_id - The order ID
   * @returns {string} The URL to fetch the order
   */
  GET_ORDER: (order_id: string) =>
    fmt(`%s/store/orders/%s`, NEXT_PUBLIC_TS_EXPRESS_URL, order_id),

  /**
   * Endpoint for updating order status
   * @param {string} order_id - The order ID
   * @returns {string} The URL to update order status
   */
  UPDATE_ORDER_STATUS: (order_id: string) =>
    fmt(`%s/store/orders/%s/status`, NEXT_PUBLIC_TS_EXPRESS_URL, order_id),

  /**
   * Endpoint for adding product to wishlist
   * @type {string}
   */
  WISHLIST_ADD: fmt(`%s/wishlist/add`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for removing product from wishlist
   * @param {string} product_id - The product ID
   * @returns {string} The URL to remove product from wishlist
   */
  WISHLIST_REMOVE: (product_id: string) =>
    fmt(`%s/wishlist/remove/%s`, NEXT_PUBLIC_TS_EXPRESS_URL, product_id),

  /**
   * Endpoint for fetching user's wishlist
   * @type {string}
   */
  WISHLIST_GET: fmt(`%s/wishlist`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for checking if product is in wishlist
   * @param {string} product_id - The product ID
   * @returns {string} The URL to check wishlist status
   */
  WISHLIST_CHECK: (product_id: string) =>
    fmt(`%s/wishlist/check/%s`, NEXT_PUBLIC_TS_EXPRESS_URL, product_id),

  /**
   * Endpoint for getting wishlist count
   * @type {string}
   */
  WISHLIST_COUNT: fmt(`%s/wishlist/count`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for clearing entire wishlist
   * @type {string}
   */
  WISHLIST_CLEAR: fmt(`%s/wishlist/clear`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for fetching store categories
   * @type {string}
   */
  GET_CATEGORIES: fmt(`%s/store/categories`, NEXT_PUBLIC_TS_EXPRESS_URL),

  /**
   * Endpoint for fetching products by category
   * @param {string} category_id - The category ID
   * @param {number} page - The page number
   * @returns {string} The URL to fetch products by category
   */
  GET_PRODUCTS_BY_CATEGORY: (category_id: string, page: number) =>
    fmt(
      `%s/store/categories/%s/products?page=%s`,
      NEXT_PUBLIC_TS_EXPRESS_URL,
      category_id,
      page
    ),
};

export default ROUTE;
