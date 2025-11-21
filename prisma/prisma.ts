import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const query =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = query;
export default query;
