import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          scope: "openid email profile",
        },
      },
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
          const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            return null;
          }

          const { user, token } = result.data;

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
            accessToken: token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.picture = user.image;
      }
      // Google login er jonno - account theke access token nao
      if (account?.provider === "google") {
        token.accessToken = account.access_token ?? "";
        token.role = "user"; // Google login e default role "user"
      }
      // Session update() call theke
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image;
        if (session.user.role) token.role = session.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
