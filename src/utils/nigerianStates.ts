// Nigerian States List
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

// Delivery fee calculation
export const LAGOS_DELIVERY_FEE = 6000;
export const OTHER_STATES_DELIVERY_FEE = 8000;
export const FREE_SHIPPING_THRESHOLD = 60000;

/**
 * Calculate delivery fee based on state and order subtotal
 * @param state - The state name
 * @param subtotal - Order subtotal before tax
 * @returns Delivery fee amount
 */
export function calculateDeliveryFee(state: string, subtotal: number): number {
  // Free shipping for orders above threshold
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  // Lagos delivery fee
  if (state.toLowerCase() === "lagos") {
    return LAGOS_DELIVERY_FEE;
  }

  // Other states delivery fee
  return OTHER_STATES_DELIVERY_FEE;
}
