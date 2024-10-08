import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string;
    warehouseId?: string;
    accessToken?: string;
  }

  interface Session {
    user: User & {
      role?: string;
      warehouseId?: string;
      accessToken?: string;
    }
  }
}