"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login successful! 🎉");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Account created! Check your email to confirm your account."
        );
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">
            {isLogin ? "Welcome back." : "Create your account."}
          </h1>

          <p className="text-gray-400">
            {isLogin
              ? "Login to your AI image studio."
              : "Start creating amazing AI images."}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">

          <label className="block text-sm text-gray-300 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-white"
          />

          <label className="block text-sm text-gray-300 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-6 outline-none focus:border-white"
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

          {message && (
            <p className="text-sm text-gray-300 text-center mt-5">
              {message}
            </p>
          )}

          <div className="text-center mt-6 text-sm text-gray-400">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-white font-semibold ml-2 hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>

        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Your account is securely powered by Supabase.
        </p>

      </div>
    </main>
  );
}