"use client";
import api from "@/utils/api";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { LogOut, Menu, X, BarChart3, Calendar, LineChart, PieChart } from "lucide-react";
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

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenseTotal, setMonthlyExpenseTotal] = useState<number>(0);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get current date in local timezone to avoid timezone issues
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);
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



  //fetch expenses for the selected date
  const fetchExpenses = useCallback(async (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    try {
      console.log(`Fetching expenses for ${year}/${monthNum}/${dayNum}`);
      const res = await api.get(`/api/expenses/entries/${year}/${monthNum}/${dayNum}`);
      console.log('Expenses response:', res.data);
      setExpenses(res.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setExpenses([]);
    }
  }, []);

  //fetch monthly income sum
  const fetchMonthlyIncomeSum = useCallback(async (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    try {
      console.log(`Fetching monthly income sum for ${year}/${monthNum}`);
      const res = await api.get(`/api/expenses/sum/incomes/${year}/${monthNum}`);
      console.log('Monthly income sum response:', res.data);
      setMonthlyIncome(res.data.totalIncome || 0);
    } catch (error) {
      console.error("Failed to fetch monthly income sum:", error);
      setMonthlyIncome(0);
    }
  }, []);

  //fetch monthly expense sum
  const fetchMonthlyExpenseSum = useCallback(async (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const monthNum = parseInt(month, 10);
    try {
      console.log(`Fetching monthly expense sum for ${year}/${monthNum}`);
      const res = await api.get(`/api/expenses/sum/expenses/${year}/${monthNum}`);
      console.log('Monthly expense sum response:', res.data);
      setMonthlyExpenseTotal(res.data.totalExpense || 0);
    } catch (error) {
      console.error("Failed to fetch monthly expense sum:", error);
      setMonthlyExpenseTotal(0);
    }
  }, []);

  //fetch total entries count
  const fetchTotalEntries = useCallback(async () => {
    try {
      console.log('Fetching total entries count');
      const res = await api.get('/api/expenses');
      console.log('Total entries response:', res.data);
      setTotalEntries(Array.isArray(res.data) ? res.data.length : 0);
    } catch (error) {
      console.error("Failed to fetch total entries:", error);
      setTotalEntries(0);
    }
  }, []);

  useEffect(() => {
    if (mounted && selectedDate) {
      fetchExpenses(selectedDate);
      fetchMonthlyIncomeSum(selectedDate);
      fetchMonthlyExpenseSum(selectedDate);
      fetchTotalEntries();
    }
  }, [mounted, selectedDate, fetchExpenses, fetchMonthlyIncomeSum, fetchMonthlyExpenseSum, fetchTotalEntries]);

  const monthlyBalance = monthlyIncome - monthlyExpenseTotal;

  const triggerStatsRefresh = () => {
    setStatsRefreshTrigger(prev => prev + 1);
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount) {
      alert("Please enter an amount");
      return;
    }
    if (newExpense.type === "expense" && !newExpense.category) {
      alert("Please select a category for expense");
      return;
    }

    const expenseData = {
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: selectedDate,
      type: newExpense.type,
    };

    try {
      setIsUpdating(true);
      const res = await api.post("/api/expenses", expenseData);
      const newExpenseFromServer = res.data;

      setExpenses([...expenses, newExpenseFromServer]);
      setNewExpense({
        category: "",
        amount: "",
        description: "",
        type: "expense",
      });
      setShowAddModal(false);

      // Also refresh from server to ensure accuracy
      await Promise.all([
        fetchExpenses(selectedDate),
        fetchMonthlyIncomeSum(selectedDate),
        fetchMonthlyExpenseSum(selectedDate),
        fetchTotalEntries()
      ]);
      
      // Trigger stats refresh
      triggerStatsRefresh();
      
      // Show success message
      console.log("Successfully added expense/income");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setIsUpdating(false);
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
    if (!editingExpense || !newExpense.amount) {
      alert("Please enter an amount");
      return;
    }
    if (newExpense.type === "expense" && !newExpense.category) {
      alert("Please select a category for expense");
      return;
    }

    const updatedData = {
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      type: newExpense.type,
    };

    try {
      setIsUpdating(true);
      await api.put(`/api/expenses/expenses/${editingExpense.id}`, updatedData);

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

      // Refresh all data from server to ensure accuracy
      await Promise.all([
        fetchExpenses(selectedDate),
        fetchMonthlyIncomeSum(selectedDate),
        fetchMonthlyExpenseSum(selectedDate),
        fetchTotalEntries()
      ]);
      
      // Trigger stats refresh
      triggerStatsRefresh();
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update expense:", error);
      alert("Failed to update expense. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setIsUpdating(true);
      await api.delete(`/api/expenses/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));

      // Refresh all data from server to ensure accuracy
      await Promise.all([
        fetchExpenses(selectedDate),
        fetchMonthlyIncomeSum(selectedDate),
        fetchMonthlyExpenseSum(selectedDate),
        fetchTotalEntries()
      ]);
      
      // Trigger stats refresh
      triggerStatsRefresh();
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense. Please try again.");
    } finally {
      setIsUpdating(false);
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
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "daily", label: "Daily Expenses", icon: <Calendar className="w-4 h-4" /> },
    { id: "monthly", label: "Monthly Overview", icon: <LineChart className="w-4 h-4" /> },
    { id: "stats", label: "Statistics", icon: <PieChart className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="w-full px-[60px]">
          <div className="flex justify-between items-center py-8">
            {/* Logo */}
            <div className="flex items-center space-x-3 -ml-2">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>WeSpend</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
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

      <div className="w-full px-8 py-8">
        {/* Tab Navigation */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-6`}>
          <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex flex-wrap space-x-1 px-4 sm:px-6">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 px-3 sm:px-4 border-b-2 font-bold text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === item.id
                      ? `border-emerald-500 text-emerald-600`
                      : `${theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }`}
                >
                  <span className="hidden sm:inline">{item.icon}</span>
                  <span className="sm:hidden">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && mounted && (
            <div className="p-6">
              {isUpdating && (
                <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-emerald-200'}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-emerald-700'}`}>Updating data...</span>
                  </div>
                </div>
              )}
              {showSuccess && (
                <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-green-800' : 'bg-green-50'} border ${theme === 'dark' ? 'border-green-600' : 'border-green-200'}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Successfully updated! Data refreshed.</span>
                  </div>
                </div>
              )}
              <CustomizableDashboard
                monthlyBalance={monthlyBalance}
                monthlyExpenseTotal={monthlyExpenseTotal}
                monthlyIncome={monthlyIncome}
                totalEntries={totalEntries}
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
          {activeTab === "stats" && <Stats refreshTrigger={statsRefreshTrigger} />}
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
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select category...</option>
                  {newExpense.type === "income" ? (
                    <option value="">Income</option>
                  ) : (
                    <>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="bills">Bills</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="medicine">Medicine</option>
                      <option value="clothing">Clothing</option>
                      <option value="sanitary">Sanitary</option>
                      <option value="educational">Educational</option>
                      <option value="others">Others</option>
                    </>
                  )}
                </select>
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
