import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
     async authorize(credentials) {
  // 1️⃣ Check if credentials exist
  if (!credentials) return null;

  // 2️⃣ Check email & password
  if (
    credentials.email === process.env.DEMO_EMAIL &&
    credentials.password === process.env.DEMO_PASSWORD
  ) {
    return { id: "1", email: credentials.email };
  }

  return null;
},

    }),
  ],
  // ✅ fix TypeScript error
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
