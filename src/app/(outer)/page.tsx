"use client";
import { useState, ChangeEvent, FormEvent, useLayoutEffect } from "react";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const page = () => {
    const router = useRouter();
    const [showQuestion, setShowQuestion] = useState(true);
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { data: session } = useSession();
    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: "",
    });

    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/auth/login`, {
                body: JSON.stringify(loginCredentials),
                method: "post",
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if (!data.error) {
                router.push("/store");
            } else {
                toast.error(data.message);
            }
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "An error occurred while logging in",
                { id: "login" }
            );
        },
    });

    const handleLoginInput = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginCredentials({
            ...loginCredentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        loginMutate();
    };

    useLayoutEffect(() => {
        if (session?.user && showLoginPage) {
            router.push("/store");
        }
    }, [session?.user, showLoginPage]);

    if (showQuestion) {
        return (
            <div className="min-h-dvh bg-black flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="text-center space-y-8 animate-in">
                        {/* Logo/Brand */}
                        <div className="space-y-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 justify-center"
                            >
                                <Image
                                    src={"/logos/logo4.svg"}
                                    alt="Logo"
                                    width={150}
                                    height={40}
                                    className="h-10"
                                />
                            </Link>
                            <p className="text-gray-300 text-lg">
                                Welcome! to PayMeFans Store
                            </p>
                        </div>

                        {/* Question Card */}
                        <div className="bg-black rounded-xl relative p-8 min-h-[60dvh] shadow-lg border border-white/10 backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold text-white mb-6">
                                Are you already a PayMeFans user?
                            </h2>
                            {/* <Image
                src={"/shop.svg"}
                alt="Shop Illustration"
                width={400}
                height={300}
                className="mx-auto mb-6"
              /> */}

                            <div className="flex flex-col w-full gap-4 left-0 p-4 absolute bottom-0">
                                {/* Yes Button */}
                                <button
                                    onClick={() => {
                                        setShowQuestion(false);
                                        setShowLoginPage(true);
                                    }}
                                    className="w-full bg-primary-dark-pink hover:bg-pink-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-dark-pink/25"
                                >
                                    Yes, I have an account
                                </button>

                                {/* No Button */}
                                <Link
                                    href={"https://paymefans.com/register"}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 border border-white/20"
                                >
                                    No, I'm new here
                                </Link>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <p className="text-sm text-gray-400">
                            Join thousands of creators earning with PayMeFans
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (showLoginPage) {
        return (
            <div className="min-h-dvh bg-black flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md animate-in">
                    {/* Login Form */}
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 justify-center"
                            >
                                <Image
                                    src={"/logos/logo4.svg"}
                                    alt="Logo"
                                    width={150}
                                    height={40}
                                    className="h-10"
                                />
                            </Link>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back
                            </h1>
                            <p className="text-gray-300">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-8 shadow-lg border border-white/10 backdrop-blur-sm">
                            <form
                                onSubmit={handleLoginSubmit}
                                className="space-y-5"
                            >
                                {/* Email Input */}
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="email"
                                        name="email"
                                        value={loginCredentials.email}
                                        onChange={handleLoginInput}
                                        className="block w-full px-4 py-3 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary-dark-pink/50 focus:ring-2 focus:ring-primary-dark-pink/20 transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="flex flex-col gap-2 relative">
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={loginCredentials.password}
                                            onChange={handleLoginInput}
                                            className="block w-full px-4 py-3 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary-dark-pink/50 focus:ring-2 focus:ring-primary-dark-pink/20 transition-all duration-200 backdrop-blur-sm"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <LucideEye className="w-5 h-5" />
                                            ) : (
                                                <LucideEyeClosed className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            id="remember"
                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-dark-pink focus:ring-primary-dark-pink/50 focus:ring-2 accent-primary-dark-pink"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="text-sm font-medium text-gray-300 cursor-pointer select-none ml-2"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        href="/reset"
                                        className="text-sm font-medium text-primary-dark-pink hover:text-pink-400 transition-colors duration-200"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 text-sm font-semibold text-white rounded-xl bg-primary-dark-pink hover:bg-pink-400 transition-all duration-200 shadow-lg hover:shadow-primary-dark-pink/25 hover:shadow-xl active:scale-[0.98]"
                                >
                                    {isPending ? "Logging in..." : "Log In"}
                                </button>
                            </form>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-300">
                                Don't have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-primary-dark-pink hover:text-pink-400 transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setShowLoginPage(false);
                                setShowQuestion(true);
                            }}
                            className="w-full text-center text-gray-400 hover:text-primary-dark-pink transition-colors"
                        >
                            ← Back to options
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default page;
