"use client";
import React, { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up API call
    console.log({ name, email, password });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[url('/assets/authbg.jpg')] bg-cover bg-center text-white">
      <div className="flex flex-col items-center gap-6 w-full sm:w-[60%] lg:w-[35%] sm:h-[60vh] h-auto rounded-2xl shadow-2xl p-8 bg-black/90">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-wide">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-1">Join us to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white w-full font-semibold p-3 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Link to login */}
        <p className="text-gray-400 text-sm">
          Already have an account?
          <a href="/login" className="text-purple-400 hover:underline ml-1">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
