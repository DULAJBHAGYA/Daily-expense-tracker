"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit3, Trash2 } from "lucide-react";
import api from "@/utils/api";
import { useThemeStore } from "@/utils/theme";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}

interface DailyExpensesProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onAddClick: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => Promise<void>;
}

const DailyExpenses: React.FC<DailyExpensesProps> = ({
  selectedDate,
  setSelectedDate,
  onAddClick,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [dailyExpenses, setDailyExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeStore();

  const fetchEntriesByDate = async (date: string) => {
    if (!date) return;
    setLoading(true);
    setError(null);

    try {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const response = await api.get(`/api/expenses/entries/${year}/${month}/${day}`);
      setDailyExpenses(response.data || []);
    } catch (err) {
      console.error("Error fetching entries:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch entries");
      setDailyExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteExpense(id);
      fetchEntriesByDate(selectedDate); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchEntriesByDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 flex-1 sm:flex-none ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <button
          onClick={onAddClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bold">Add New</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading entries...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 mb-4">
          Error: {error}
        </p>
      )}

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {!loading && dailyExpenses.length === 0 ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No expenses found for this date
          </div>
        ) : (
          <div className="space-y-4">
            {dailyExpenses.map((expense) => (
              <div
                key={expense.id}
                className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {expense.type === "income" ? "Income" : "Expense"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {expense.category.toUpperCase()}
                  </div>
                  <div className={`text-sm ${expense.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {expense.amount.toFixed(2)} LKR
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                    {expense.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-sm font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Type</th>
              <th className={`px-6 py-3 text-left text-sm font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
              <th className={`px-6 py-3 text-left text-sm font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Amount</th>
              <th className={`px-6 py-3 text-left text-sm font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Description</th>
              <th className={`px-6 py-3 text-left text-sm font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {!loading && dailyExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No expenses found for this date
                </td>
              </tr>
            ) : (
              dailyExpenses.map((expense) => (
                <tr key={expense.id} className={`hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {expense.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {expense.category.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={expense.type === "income" ? "text-green-600" : "text-red-600"}>
                      {expense.amount.toFixed(2)} LKR
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm max-w-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyExpenses;
