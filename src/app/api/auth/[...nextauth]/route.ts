import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type NextAuthUser = {
  id?: string;
  email?: string;
  name?: string;
  image?: string;
  role?: UserRole;
  accessToken?: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            return {
              id: data.data.user._id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              image: data.data.user.avatar,
              accessToken: data.data.token,
            };
          }
        } catch (error) {
          console.error("Credentials authorize error:", error);
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const authUser = user as NextAuthUser;

      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: authUser.email,
              name: authUser.name,
              avatar: authUser.image,
              provider: account.provider,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            authUser.id = data.data.user._id;
            authUser.role = data.data.user.role;
            authUser.accessToken = data.data.token;
            return true;
          }
        } catch (error) {
          console.error("OAuth signIn error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      const authUser = user as NextAuthUser;

      if (authUser) {
        token.id = authUser.id;
        token.role = authUser.role;
        token.accessToken = authUser.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
