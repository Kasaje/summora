"use client";

import { useAuth, useAuthActions } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SettingPage() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      // Add your delete account API call here
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Account deleted successfully.");
        logout();
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Delete Account</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently remove your account and all associated data
                </p>
              </div>
              <button
                onClick={() => router.push("/home")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 mb-6">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-900">⚠️ Warning</h2>
            <p className="text-sm text-red-600 mt-1">
              This action is permanent and cannot be undone
            </p>
          </div>
          <div className="px-6 py-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                What happens when you delete your account?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Your account (@{user.username}) will be permanently deleted
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  All your personal data and transaction history will be removed
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  You will be immediately logged out from all devices
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  This action cannot be reversed or undone
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-700">
                <strong>Account Details:</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">Username: @{user.username}</p>
              {user.name && <p className="text-sm text-gray-600">Name: {user.name}</p>}
              <p className="text-sm text-gray-600">
                Member since:{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="bg-red-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete your account and remove
                all your data from our servers.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Please type <span className="font-bold">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Type DELETE to confirm"
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeleteConfirmText("");
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== "DELETE"}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
