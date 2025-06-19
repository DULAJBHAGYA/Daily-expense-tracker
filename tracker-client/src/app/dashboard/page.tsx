"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  Wallet,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Stats from "@/components/stats";
import DailyExpenses from "@/components/daily";
import MonthlyOverview from "@/components/monthly";

interface Expense {
  id: string;
  reason: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      reason: "Groceries",
      amount: 75.5,
      description: "Weekly grocery shopping at supermarket",
      date: "2025-06-18",
      type: "expense",
    },
    {
      id: "2",
      reason: "Salary",
      amount: 3000,
      description: "Monthly salary deposit",
      date: "2025-06-18",
      type: "income",
    },
    {
      id: "3",
      reason: "Coffee",
      amount: 4.5,
      description: "Morning coffee from cafe",
      date: "2025-06-18",
      type: "expense",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState("daily");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    reason: "",
    amount: "",
    description: "",
    type: "expense" as "expense" | "income",
  });

  const { user } = useUser();

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter expenses by current month for monthly view
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // Calculate totals
  const todayExpenses = expenses
    .filter((expense) => expense.date === today && expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyIncome = monthlyExpenses
    .filter((expense) => expense.type === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyExpenseTotal = monthlyExpenses
    .filter((expense) => expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenseTotal;

  const handleAddExpense = () => {
    if (!newExpense.reason || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      reason: newExpense.reason,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: selectedDate,
      type: newExpense.type,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ reason: "", amount: "", description: "", type: "expense" });
    setShowAddModal(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setNewExpense({
      reason: expense.reason,
      amount: expense.amount.toString(),
      description: expense.description,
      type: expense.type,
    });
    setShowAddModal(true);
  };

  const handleUpdateExpense = () => {
    if (!editingExpense || !newExpense.reason || !newExpense.amount) return;

    setExpenses(
      expenses.map((expense) =>
        expense.id === editingExpense.id
          ? {
              ...expense,
              reason: newExpense.reason,
              amount: parseFloat(newExpense.amount),
              description: newExpense.description,
              type: newExpense.type,
            }
          : expense
      )
    );

    setEditingExpense(null);
    setNewExpense({ reason: "", amount: "", description: "", type: "expense" });
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    setNewExpense({ reason: "", amount: "", description: "", type: "expense" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
              <h1 className="text-3xl font-bold text-gray-900">WeSpend</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user?.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                    {user?.firstName?.[0] ?? "U"}
                  </div>
                )}
                <span className="text-gray-700 font-medium">
                  {user?.firstName + " " + user?.lastName}
                </span>
              </div>
              <SignOutButton redirectUrl="/sign-in">
                <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">
                  Today&apos;s Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayExpenses.toFixed(2)} lkr
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Monthly Income
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyIncome.toFixed(2)} lkr
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Monthly Balance
                </p>
                <p
                  className={`text-2xl font-bold ${
                    monthlyBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {monthlyBalance.toFixed(2)} lkr
                </p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("daily")}
                className={`py-4 px-1 border-b-2 font-bold text-sm ${
                  activeTab === "daily"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Daily Expenses
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`py-4 px-1 border-b-2 font-bold text-sm ${
                  activeTab === "monthly"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Monthly Overview
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`py-4 px-1 border-b-2 font-bold text-sm ${
                  activeTab === "stats"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>

          {/* Daily Expenses Tab */}
          {activeTab === "daily" && (
            <DailyExpenses
              expenses={expenses}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAddClick={() => setShowAddModal(true)}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {/* Monthly Overview Tab */}
          {activeTab === "monthly" && (
            <MonthlyOverview
              expenses={expenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && <Stats />}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingExpense
                ? "Edit Entry"
                : `Add ${newExpense.type === "income" ? "Income" : "Expense"}`}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newExpense.type}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      type: e.target.value as "expense" | "income",
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={newExpense.reason}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, reason: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter reason..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-20 resize-none"
                  placeholder="Enter description..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingExpense ? handleUpdateExpense : handleAddExpense
                }
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingExpense ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;