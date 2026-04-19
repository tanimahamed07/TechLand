import type { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}
