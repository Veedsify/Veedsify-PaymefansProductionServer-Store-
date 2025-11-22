import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID || "paymefans-store",
  eventKey: process.env.INNGEST_EVENT_KEY,
  baseUrl:
    "http://inngest-queue-server-inngest-89c0fe-72-61-185-122.traefik.me/",
  isDev: process.env.NODE_ENV === "development",
});
