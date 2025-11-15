"use client";
import axiosInstance from "@/utils/Axios";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { create } from "zustand";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  is_model: boolean;
  location: string;
  user_id: string;
};
type UserContext = {
  user: Partial<User> | null;
  updateUser: (user: Partial<User>) => void;
};

export const useUserContext = create<UserContext>()((set) => ({
  user: null,
  updateUser: (user: Partial<User>) => set({ user }),
}));

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const updateUser = useUserContext((state) => state.updateUser);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosInstance.get(`/auth/retrieve`);
        const userData = response.data && (response.data.user as User);
        const user = response.data.user;
        updateUser(userData ? user : null);
        console.log(response);
        if (!user) {
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    }

    if (typeof window !== "undefined") {
      getUser();
    }
  }, []);

  return <div>{children}</div>;
};
