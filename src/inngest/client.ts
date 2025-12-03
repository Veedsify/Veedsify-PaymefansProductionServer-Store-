import { Inngest } from "inngest";

// Create a client to send and receive events
const env =
  process.env.NODE_ENV === "development" ? "development" : "production";

export const inngest = (() => {
  if (env === "development") {
    return new Inngest({
      id: process.env.INNGEST_APP_ID || "paymefans-admin",
      isDev: true,
    });
  }
  return new Inngest({
    id: process.env.INNGEST_APP_ID || "paymefans-admin",
    eventKey: process.env.INNGEST_EVENT_KEY,
    baseUrl: "https://inngest.paymefans.com",
    isDev: false,
  });
})();