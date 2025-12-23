import ComparePasswordHash from "@/server/bcrypt";
import UserService from "@/server/UserSevice";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export type UserAuth = {
  id: number;
  email: string;
  name: string;
  username: string;
  role: string;
  is_active: boolean;
  is_model: boolean;
  location: string;
  user_id: string;
  error?: boolean;
  errorMessage?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/",
    newUser: "/store",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
        token.is_active = user.is_active;
        token.is_model = user.is_model;
        token.location = user.location;
        token.user_id = user.user_id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        (session.user as UserAuth) = {
          id: token.id as number,
          email: token.email as string,
          name: token.name as string,
          username: token.username as string,
          role: token.role as string,
          is_active: token.is_active as boolean,
          is_model: token.is_model as boolean,
          location: token.location as string,
          user_id: token.user_id as string,
        };
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const data = await UserService.getUserByEmail(
          credentials.email as string,
        );

        if (!data || data.error) {
          return null;
        }

        if (data.data && !data.data.active_status) {
          return null;
        }

        if (data.data.should_delete) {
          return null;
        }

        const match = await ComparePasswordHash(
          credentials.password as string,
          data.data.password,
        );

        if (!match) {
          return null;
        }

        const { password, ...rest } = data.data;

        return rest;
      },
    }),
  ],
});
