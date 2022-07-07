import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      // clientId: process.env.GOOGLE_ID || "",
      // clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    // ...add more providers here
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     name: {
    //       label: "Name",
    //       type: "text",
    //       placeholder: "Enter your name",
    //     },
    //   },
    //   async authorize(credentials, _req) {
    //     const user = { id: 1, name: credentials?.name ?? "J Smith" };
    //     return user;
    //   },
    // }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.organizationId = user?.organizationId;
      return session;
      // return Promise.resolve({session: {
      //   expires: session.expires,
      //   user: {
      //     name: user.name,
      //     email: user.email,
      //     image: user.image,
      //     organizationId: user.organizationId as String || null
      //   },

      //  }})
    },
  },
};

export default NextAuth(authOptions);
