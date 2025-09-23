"use client";

import React from "react";
import { useAuth } from "../../context/AuthProvider";

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-md">
        <h1 className="text-xl font-bold">Summora Accounting</h1>
        <div>
          <span className="mr-4">Welcome, {user}!</span>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <p className="text-gray-700">
          This is your accounting dashboard. Here you can manage your income and
          expenses.
        </p>

        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">User Information</h3>
          <p className="text-gray-600">
            Username: <strong>{user}</strong>
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
