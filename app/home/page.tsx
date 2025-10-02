"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import Navbar from "../../components/Navbar";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: "THB";
}

const HomePage = () => {
  const auth = useAuth();
  const user = auth?.user;

  // Mock data for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 120000,
      category: "Salary",
      description: "Monthly salary",
      date: "2025-09-20",
      currency: "THB",
    },
    {
      id: "2",
      type: "expense",
      amount: 5500,
      category: "Food",
      description: "Groceries",
      date: "2025-09-19",
      currency: "THB",
    },
    {
      id: "3",
      type: "expense",
      amount: 1500,
      category: "Transportation",
      description: "Gas",
      date: "2025-09-18",
      currency: "THB",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // All amounts are in THB (Thai Baht)

  // Calculate totals in THB
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch("/api/categories/list", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const categoryData = await response.json();
        setCategories(categoryData || []);
      } else {
        console.error("Failed to fetch categories");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch categories when user arrives at home page (background loading)
  useEffect(() => {
    fetchCategories();
  }, []);

  const formatCurrency = (amount: number, compact: boolean = false) => {
    // For very large numbers, use compact notation
    if (compact && Math.abs(amount) >= 1000000) {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        currencyDisplay: "symbol",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount);
    }

    // For regular numbers, add thousand separators
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setModalMode("create");
    setIsModalAnimating(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setIsModalAnimating(false);
    }, 150);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalMode("edit");
    setIsModalAnimating(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setIsModalAnimating(false);
    }, 150);
  };

  const handleCloseModal = () => {
    setIsModalAnimating(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalAnimating(false);
    }, 200);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">
                Welcome back, {user?.name}! Here&apos;s your accounting overview.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateTransaction}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-95 transform transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <div className="bg-white/20 rounded-lg p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="font-medium">Add Transaction</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Dashboard Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p
                  className="text-2xl lg:text-3xl font-bold text-green-600 truncate"
                  title={formatCurrency(totalIncome)}
                >
                  {formatCurrency(totalIncome, true)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All amounts in Thai Baht (THB)</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p
                  className="text-2xl lg:text-3xl font-bold text-red-600 truncate"
                  title={formatCurrency(totalExpense)}
                >
                  {formatCurrency(totalExpense, true)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All amounts in Thai Baht (THB)</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p
                  className={`text-2xl lg:text-3xl font-bold truncate ${
                    netBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                  title={formatCurrency(netBalance)}
                >
                  {formatCurrency(netBalance, true)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Thai Baht (฿) - Official Currency</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {transaction.category}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.description || "No description"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right min-w-0">
                      <span
                        className={`text-lg font-semibold block truncate ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                        title={`${transaction.type === "income" ? "+" : "-"}${formatCurrency(
                          transaction.amount
                        )}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount, true)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition duration-200"
                        title="Edit transaction"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(transaction.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition duration-200"
                        title="Delete transaction"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {isModalOpen && (
        <TransactionModal
          mode={modalMode}
          transaction={editingTransaction}
          onClose={handleCloseModal}
          onSubmit={(transaction) => {
            if (modalMode === "create") {
              const newTransaction = {
                ...transaction,
                id: Date.now().toString(),
              };
              setTransactions((prev) => [newTransaction, ...prev]);
            } else {
              setTransactions((prev) =>
                prev.map((t) =>
                  t.id === editingTransaction?.id
                    ? { ...transaction, id: editingTransaction.id }
                    : t
                )
              );
            }
            handleCloseModal();
          }}
          isAnimating={isModalAnimating}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => handleDeleteTransaction(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// Transaction Modal Component
interface TransactionModalProps {
  mode: "create" | "edit";
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  isAnimating?: boolean;
  categories: { name: string }[];
  isLoadingCategories: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  mode,
  transaction,
  onClose,
  onSubmit,
  isAnimating = false,
  categories,
  isLoadingCategories,
}) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || ("expense" as "income" | "expense"),
    amount: transaction?.amount?.toString() || "",
    category: transaction?.category || "",
    description: transaction?.description || "",
    date: transaction?.date || new Date().toISOString().split("T")[0],
    currency: "THB" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    onSubmit({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      currency: formData.currency,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 transform transition-all duration-300 relative ${
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {mode === "create" ? "✨ Add New Transaction" : "📝 Edit Transaction"}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {mode === "create"
                  ? "Track your income and expenses easily"
                  : "Update your transaction details"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
              title="Close"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <span className="ml-3 text-sm text-green-600 font-semibold group-hover:text-green-700 transition duration-200 flex items-center">
                      💰 Income
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="ml-3 text-sm text-red-600 font-semibold group-hover:text-red-700 transition duration-200 flex items-center">
                      💸 Expense
                    </span>
                  </label>
                </div>
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    💳 Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    �🇭 Currency
                  </label>
                  <div className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 font-medium">
                    THB (฿) - Thai Baht
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  📂 Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400 bg-white"
                >
                  <option value="" hidden>
                    {isLoadingCategories ? "Loading categories..." : "Choose a category..."}
                  </option>
                  {!isLoadingCategories &&
                    categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  � Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  � Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400 resize-none"
                  placeholder="Add some notes about this transaction..."
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 active:scale-95 transform transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.amount || !formData.category || isLoadingCategories}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-95 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{mode === "create" ? "Add Transaction" : "Update Transaction"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Transaction</h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
