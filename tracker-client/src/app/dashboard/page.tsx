"use client";
import axios from "axios";
import api from "@/utils/api";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, LogOut, Wallet, Menu, X } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Stats from "@/components/stats";
import DailyExpenses from "@/components/daily";
import MonthlyOverview from "@/components/monthly";
import CustomizableDashboard from "@/components/CustomizableDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import { useThemeStore } from "@/utils/theme";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    type: "expense" as "expense" | "income",
  });

  const { user } = useUser();
  const { theme } = useThemeStore();

  // const today = new Date().toISOString().split("T")[0];
  // const currentMonth = new Date().getMonth() + 1;
  // const currentYear = new Date().getFullYear();

  //fetch today expenses sum
  const fetchTodayExpenseSum = async (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    try {
      console.log(`Fetching expense sum for ${year}/${monthNum}/${dayNum}`);
      const res = await api.get(`/api/expenses/sum/expense/${year}/${monthNum}/${dayNum}`);
      console.log('Expense sum response:', res.data);
      setTodayExpenseSum(res.data.totalDayExpense || 0);
    } catch (error) {
      console.error("Failed to fetch today expense sum:", error);
      // Set default value if server is not available
      setTodayExpenseSum(0);
    }
  };

  //fetch today incomes sum
  const fetchTodayIncomeSum = async (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    try {
      console.log(`Fetching income sum for ${year}/${monthNum}/${dayNum}`);
      const res = await api.get(`/api/expenses/sum/income/${year}/${monthNum}/${dayNum}`);
      console.log('Income sum response:', res.data);
      setTodayIncomeSum(res.data.totalDayIncome || 0);
    } catch (error) {
      console.error("Failed to fetch today income sum:", error);
      // Set default value if server is not available
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

  const tabItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "daily", label: "Daily Expenses", icon: "📅" },
    { id: "monthly", label: "Monthly Overview", icon: "📈" },
    { id: "stats", label: "Statistics", icon: "📊" },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>WeSpend</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* User Info */}
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
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.firstName + " " + user?.lastName}
                </span>
              </div>
              
              <ThemeToggle />
 
              <SignOutButton redirectUrl="/sign-in">
                <button className={`p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'} rounded-lg transition-colors`}>
                  <LogOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-4">
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
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.firstName + " " + user?.lastName}
                  </span>
                </div>
                
                <SignOutButton redirectUrl="/sign-in">
                  <button className={`w-full flex items-center space-x-2 p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'} transition-colors`}>
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-6`}>
          <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex flex-wrap space-x-1 px-4 sm:px-6">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 px-3 sm:px-4 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === item.id
                      ? `border-emerald-500 text-emerald-600`
                      : `${theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }`}
                >
                  <span className="hidden sm:inline mr-2">{item.icon}</span>
                  <span className="sm:hidden">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="p-6">
              <CustomizableDashboard
                todayExpenseSum={todayExpenseSum}
                todayIncomeSum={todayIncomeSum}
                monthlyBalance={monthlyBalance}
              />
            </div>
          )}

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
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {editingExpense
                ? "Edit Entry"
                : `Add ${newExpense.type === "income" ? "Income" : "Expense"}`}
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter reason..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-20 resize-none ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter description..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeModal}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
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
