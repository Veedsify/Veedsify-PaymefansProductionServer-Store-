"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    return <SessionProvider>{children}</SessionProvider>;
};
