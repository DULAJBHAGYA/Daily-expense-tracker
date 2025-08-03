"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { useThemeStore } from "@/utils/theme";

interface MonthlySummaryItem {
  year: number;
  month: string;
  income: number;
  expense: number;
}

const MonthlySummary: React.FC = () => {
  const [summary, setSummary] = useState<MonthlySummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeStore();

  const fetchMonthlySummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/expenses/summary/june-2025");
      setSummary(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        Monthly Summary (from June 2025)
      </h2>

      {loading && (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading summary...
        </p>
      )}
      
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && summary.length === 0 && (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No data available.
        </p>
      )}

      {summary.length > 0 && (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-4">
            {summary.map((item) => (
              <div
                key={`${item.month}-${item.year}`}
                className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {`${item.month} ${item.year}`}
                  </h3>
                  <span
                    className={`font-bold text-sm ${
                      item.income - item.expense >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {(item.income - item.expense).toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Income
                    </span>
                    <span className="text-sm text-green-600 font-semibold">
                      {item.income.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Expense
                    </span>
                    <span className="text-sm text-red-600 font-semibold">
                      {item.expense.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} text-sm`}>
              <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Month
                  </th>
                  <th className={`px-6 py-3 text-left font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Income (LKR)
                  </th>
                  <th className={`px-6 py-3 text-left font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Expense (LKR)
                  </th>
                  <th className={`px-6 py-3 text-left font-bold uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                {summary.map((item) => (
                  <tr key={`${item.month}-${item.year}`} className={`hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {`${item.month} ${item.year}`}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {item.income.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-red-600 font-semibold">
                      {item.expense.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 font-bold ${
                        item.income - item.expense >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(item.income - item.expense).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlySummary;
