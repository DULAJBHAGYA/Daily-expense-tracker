"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit3, Trash2 } from "lucide-react";
import api from "@/utils/api";

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

  const fetchEntriesByDate = async (date: string) => {
    if (!date) return;
    setLoading(true);
    setError(null);

    try {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const response = await api.get(`/entries/${year}/${month}/${day}`);
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-black" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          onClick={onAddClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bold">Add New</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mb-4">Loading entries...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 mb-4">
          Error: {error}
        </p>
      )}

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && dailyExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No expenses found for this date
                </td>
              </tr>
            ) : (
              dailyExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {expense.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.category.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={expense.type === "income" ? "text-green-600" : "text-red-600"}>
                      {expense.amount.toFixed(2)} LKR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="text-emerald-600 hover:text-emerald-900 p-1 hover:bg-emerald-50 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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
