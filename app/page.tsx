"use client";

import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { Iuser } from "@/interface";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation: non-empty username & password
    setUsernameError(null);
    setPasswordError(null);

    if (!username.trim()) {
      setUsernameError("Username is required");
      usernameRef.current?.focus();
      return;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      passwordRef.current?.focus();
      return;
    }

    const payload = { username, password };

    // Debug: log the outgoing payload
    console.log("Sending login request to /api/auth/login", payload);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      // Debug: log status and parsed body
      console.log("Received response from /api/auth/login", {
        status: res.status,
        body,
      });

      if (res.status === 200) {
        toast.success(body?.message || "Login successful");
        console.log("accesstoken => ", body.accessToken);
        setUser({ username } as Iuser);
        router.push("/home");
      } else {
        toast.error(body?.message || `Login failed (status ${res.status})`);
      }
    } catch (err) {
      console.error("Network error while calling /api/auth/login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2 border border-gray-200"
        aria-label="Sign in form"
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-xl font-bold text-blue-900">Summora</h1>
        </div>

        <h2 className="text-md text-blue-900 pb-2">Sign in</h2>

        <label className="sr-only" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          ref={usernameRef}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError(null);
          }}
          placeholder="Email or username"
          className={`w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border ${
            usernameError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <p
          className={`text-xs my-1 h-3 flex items-center ${
            usernameError ? "text-red-600" : "text-transparent"
          }`}
          aria-live="polite"
        >
          {usernameError || "\u00A0"}
        </p>

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          ref={passwordRef}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          placeholder="Password"
          className={`w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border ${
            passwordError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <p
          className={`text-xs my-1 h-3 flex items-center ${
            passwordError ? "text-red-600" : "text-transparent"
          }`}
          aria-live="polite"
        >
          {passwordError || "\u00A0"}
        </p>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-blue-500 disabled:opacity-60 border border-blue-700"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </div>

        <div className="flex items-center justify-center mt-4">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline ml-1">
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
