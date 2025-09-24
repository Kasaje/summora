"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation: non-empty fields
    setUsernameError(null);
    setPasswordError(null);
    setNameError(null);

    if (!name.trim()) {
      setNameError("Name is required");
      nameRef.current?.focus();
      return;
    }
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

    const payload = { username, password, name };

    setLoading(true);
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      console.log("body =>", body);
      console.log("res.status =>", res.status);
      console.log("body.message =>", body?.message);

      if (res.status === 201) {
        toast.success(body?.message || "Registration successful");
        router.push("/");
      } else {
        toast.error(
          body?.message || `Registration failed (status ${res.status})`
        );
      }
    } catch (err) {
      console.error("Network error while calling /api/auth/register:", err);
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
        aria-label="Register form"
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-xl font-bold text-blue-900">Summora</h1>
        </div>

        <h2 className="text-md text-blue-900 pb-2">Register</h2>

        <label className="sr-only" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          ref={nameRef}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          placeholder="Full name"
          className={`w-full bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border ${
            nameError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <p
          className={`text-xs my-1 h-3 flex items-center ${
            nameError ? "text-red-600" : "text-transparent"
          }`}
          aria-live="polite"
        >
          {nameError || "\u00A0"}
        </p>

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
          placeholder="Username"
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
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
