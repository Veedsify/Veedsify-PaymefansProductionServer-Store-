import { UserAuth } from "./auth";

declare module "next-auth" {
    interface Session {
        user: UserAuth;
    }

    interface User extends UserAuth { }
}

declare module "next-auth/jwt" {
    interface JWT extends UserAuth { }
}
