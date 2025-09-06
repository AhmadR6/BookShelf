"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add login logic
    console.log({ email, password });
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
          <input
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
            placeholder="Email address"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a
            href="/forgot-password"
            className="self-end text-gray-400 text-sm hover:text-white transition-colors"
          >
            Forgot Password?
          </a>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white w-full font-semibold p-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?
          <a href="/signup" className="text-purple-400 hover:underline ml-1">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
