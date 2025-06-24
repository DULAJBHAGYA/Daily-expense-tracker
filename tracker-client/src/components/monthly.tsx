"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";

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

  const fetchMonthlySummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/summary/from-june-2025");
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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Monthly Summary (from June 2025)</h2>

      {loading && <p className="text-gray-500">Loading summary...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && summary.length === 0 && <p className="text-gray-500">No data available.</p>}

      {summary.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Income (LKR)</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Expense (LKR)</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary.map((item) => (
                <tr key={`${item.month}-${item.year}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{`${item.month} ${item.year}`}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{item.income.toFixed(2)}</td>
                  <td className="px-6 py-4 text-red-600 font-semibold">{item.expense.toFixed(2)}</td>
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
      )}
    </div>
  );
};

export default MonthlySummary;
