"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerMutation.mutateAsync({ name, email, password });
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === "object" && "response" in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(
          apiError.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    }
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
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={registerMutation.isPending}
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={registerMutation.isPending}
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={registerMutation.isPending}
            className="bg-[#1c1c1f] border border-gray-700 p-3 rounded-lg w-full placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white w-full font-semibold p-3 rounded-lg transition-colors"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Link to login */}
        <p className="text-gray-400 text-sm">
          Already have an account?
          <Link to="/login" className="text-purple-400 hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
