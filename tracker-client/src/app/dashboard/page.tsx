"use client";
import axios from "axios";
import api from "@/utils/api";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, LogOut, Wallet } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Stats from "@/components/stats";
import DailyExpenses from "@/components/daily";
import MonthlyOverview from "@/components/monthly";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}

const ExpenseTracker = () => {
  const [todayExpenseSum, setTodayExpenseSum] = useState<number>(0);
  const [todayIncomeSum, setTodayIncomeSum] = useState<number>(0);
  const [monthlyIncome] = useState<number>(0);
  const [monthlyExpenseTotal] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState("daily");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    type: "expense" as "expense" | "income",
  });

  const { user } = useUser();

  // const today = new Date().toISOString().split("T")[0];
  // const currentMonth = new Date().getMonth() + 1;
  // const currentYear = new Date().getFullYear();

  //fetch today expenses sum
  const fetchTodayExpenseSum = async (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    try {
      const res = await api.get(`/sum/expense/${year}/${monthNum}/${dayNum}`);
      setTodayExpenseSum(res.data.totalDayExpense || 0);
    } catch (error) {
      console.error("Failed to fetch today expense sum:", error);
      setTodayExpenseSum(0);
    }
  };

  //fetch today incomes sum
  const fetchTodayIncomeSum = async (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    try {
      const res = await api.get(`/sum/income/${year}/${monthNum}/${dayNum}`);
      setTodayIncomeSum(res.data.totalDayIncome || 0);
    } catch (error) {
      console.error("Failed to fetch today income sum:", error);
      setTodayIncomeSum(0);
    }
  };

  useEffect(() => {
    fetchTodayExpenseSum(selectedDate);
    fetchTodayIncomeSum(selectedDate);
  }, [selectedDate]);

  const monthlyBalance = monthlyIncome - monthlyExpenseTotal;

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return;

    const expenseData = {
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: selectedDate,
      type: newExpense.type,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/expenses",
        expenseData
      );
      const newExpenseFromServer = res.data;

      setExpenses([...expenses, newExpenseFromServer]);
      setNewExpense({
        category: "",
        amount: "",
        description: "",
        type: "expense",
      });
      setShowAddModal(false);

      // Refresh the sums
      fetchTodayExpenseSum(selectedDate);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      type: expense.type,
    });
    setShowAddModal(true);
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense || !newExpense.category || !newExpense.amount) return;

    const updatedData = {
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      type: newExpense.type,
    };

    try {
      await axios.put(
        `http://localhost:4000/api/expenses/${editingExpense.id}`,
        updatedData
      );

      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense.id
            ? { ...expense, ...updatedData }
            : expense
        )
      );

      setEditingExpense(null);
      setNewExpense({
        category: "",
        amount: "",
        description: "",
        type: "expense",
      });
      setShowAddModal(false);

      // Refresh the sums
      fetchTodayExpenseSum(selectedDate);
      fetchTodayIncomeSum(selectedDate);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));

      // Refresh the sums
      fetchTodayExpenseSum(selectedDate);
      fetchTodayIncomeSum(selectedDate);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    setNewExpense({
      category: "",
      amount: "",
      description: "",
      type: "expense",
    });
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">
                  Today&apos;s Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayExpenseSum.toFixed(2)} lkr
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Today&apos;s Incomes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayIncomeSum.toFixed(2)} lkr
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Savings</p>
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
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAddClick={() => setShowAddModal(true)}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {/* Monthly Overview Tab */}
          {activeTab === "monthly" && (
            <MonthlyOverview/>
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
                  Category
                </label>
                <input
                  type="text"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
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
