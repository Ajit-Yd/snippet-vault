import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

const productionDomains = [
  "https://snippet-vault-lovat.vercel.app",
  "https://snippet-vault-ajit14.vercel.app",
  "https://snippet-vault-git-main-ajit14.vercel.app",
];

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    ...productionDomains,
    "http://localhost:3000",
  ],
});