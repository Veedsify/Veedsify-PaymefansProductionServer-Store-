"use client";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getToken } from "./Cookie";

if (!process.env.NEXT_PUBLIC_TS_EXPRESS_URL) {
  throw new Error("NEXT_PUBLIC_TS_EXPRESS_URL is not defined");
}

const token = getToken();

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TS_EXPRESS_URL as string,
  withCredentials: true,
  headers: {
    Authorization: token,
  },
});

export default axiosInstance;
