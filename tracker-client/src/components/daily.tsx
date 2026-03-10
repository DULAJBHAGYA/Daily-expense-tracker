"use client";
import React, { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import api from "@/utils/api";
import { FiEdit, FiPlus } from "react-icons/fi";
import { FaRegCalendar, FaRegTrashAlt } from "react-icons/fa";

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
  const [dailyIncomeTotal, setDailyIncomeTotal] = useState<number>(0);
  const [dailyExpenseTotal, setDailyExpenseTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyIncomeTotal = async (date: string) => {
    if (!date) return;
    
    try {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const response = await api.get(`/api/expenses/sum/income/${year}/${month}/${day}`);
      setDailyIncomeTotal(response.data.totalDayIncome || 0);
    } catch (err) {
      console.error("Error fetching daily income total:", err);
      setDailyIncomeTotal(0);
    }
  };

  const fetchDailyExpenseTotal = async (date: string) => {
    if (!date) return;
    
    try {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const response = await api.get(`/api/expenses/sum/expense/${year}/${month}/${day}`);
      setDailyExpenseTotal(response.data.totalDayExpense || 0);
    } catch (err) {
      console.error("Error fetching daily expense total:", err);
      setDailyExpenseTotal(0);
    }
  };

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
    fetchDailyIncomeTotal(selectedDate);
    fetchDailyExpenseTotal(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Daily Expenses
      </h2>
      
      {/* Daily Totals Display */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Daily Income
              </span>
              <span className="text-lg font-bold text-[#15994e]">
                {dailyIncomeTotal.toFixed(2)} LKR
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Daily Expenses
              </span>
              <span className="text-lg font-bold text-red-700">
                {dailyExpenseTotal.toFixed(2)} LKR
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Daily Balance
            </span>
            <span className={`text-lg font-bold ${(dailyIncomeTotal - dailyExpenseTotal) >= 0 ? 'text-[#15994e]' : 'text-red-700'}`}>
              {(dailyIncomeTotal - dailyExpenseTotal).toFixed(2)} LKR
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <FaRegCalendar className="w-5 h-5 text-gray-700" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-[#15994e] flex-1 sm:flex-none bg-white border-gray-300 text-gray-900"
          />
        </div>
        <button
          onClick={onAddClick}
          className="bg-[#15994e] hover:bg-[#137a3d] text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-4 h-4" />
          <span className="font-semibold">Add New</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center mb-4 text-gray-500">
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
          <div className="text-center py-8 text-gray-500">
            No expenses found for this date
          </div>
        ) : (
          <div className="space-y-4">
            {dailyExpenses.map((expense, index) => (
              <div
                key={expense.id || `expense-${index}`}
                className="p-4 rounded-xl border bg-white border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {expense.type === "income" ? "Income" : "Expense"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="text-[#15994e] hover:text-[#137a3d] p-1 hover:bg-[#d1fae5] rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {expense.category.toUpperCase()}
                  </div>
                  <div className={`text-sm ${expense.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {expense.amount.toFixed(2)} LKR
                  </div>
                  <div className="text-sm text-gray-500 truncate">
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-500">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-500">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {!loading && dailyExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No expenses found for this date
                </td>
              </tr>
            ) : (
              dailyExpenses.map((expense, index) => (
                <tr key={expense.id || `expense-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.type === "income" ? "bg-green-100 text-[#15994e]" : "bg-red-100 text-red-700"
                    }`}>
                      {expense.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={expense.type === "income" ? "text-[#15994e]" : "text-red-600"}>
                      {expense.amount.toFixed(2)} LKR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate text-gray-500">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="text-[#15994e] hover:text-[#0f6f3a] p-1 hover:bg-[#e6f4ea] rounded"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-700 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      >
                        <FaRegTrashAlt className="w-4 h-4" />
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
