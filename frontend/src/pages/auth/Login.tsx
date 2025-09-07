"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === "object" && "response" in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(
          apiError.response?.data?.message || "Login failed. Please try again."
        );
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[url('/assets/authbg.jpg')] bg-cover bg-center text-white">
      <div className="flex flex-col items-center gap-6 w-full sm:w-[60%] lg:w-[35%] sm:h-[50vh] h-auto  rounded-2xl shadow-2xl p-8 bg-black opacity-90">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-wide">Welcome Back</h2>
          <image />
          <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
            placeholder="Email address"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loginMutation.isPending}
          />
          <input
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loginMutation.isPending}
          />

          <Link
            to="/forgot-password"
            className="self-end text-gray-400 text-sm hover:text-white transition-colors"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white w-full font-semibold p-3 rounded-lg transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?
          <Link to="/signup" className="text-purple-400 hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
