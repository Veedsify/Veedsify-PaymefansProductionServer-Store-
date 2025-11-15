"use client";
import { ERROR_STATUS } from "@/constants/error_status";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

// Define types for better type safety
interface RetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

if (!process.env.NEXT_PUBLIC_TS_EXPRESS_URL) {
  throw new Error("NEXT_PUBLIC_TS_EXPRESS_URL is not defined");
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TS_EXPRESS_URL as string,
  withCredentials: true,
});

// Global state to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Custom error class to indicate auth failure that should set guest state
class AuthFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthFailureError";
  }
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export default axiosInstance;
export { AuthFailureError };
