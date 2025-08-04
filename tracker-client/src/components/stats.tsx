import React, { useEffect, useState, useCallback } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import api from "@/utils/api";
import { useThemeStore } from "@/utils/theme";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface PieData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
    hoverOffset: number;
  }[];
}

interface LineData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
    pointRadius: number;
  }[];
}

interface ExpenseSummary {
  category: string;
  sum: number;
  percentage: number;
}

interface MonthlySummaryResponse {
  totalAmount: number;
  summary: ExpenseSummary[];
}

interface YearlyExpensesResponse {
  year: number;
  monthlyExpenses: number[];
}

interface MonthlyNetBalanceResponse {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

interface StatsProps {
  refreshTrigger?: number;
}

const Stats: React.FC<StatsProps> = ({ refreshTrigger = 0 }) => {
  const [pieData, setPieData] = useState<PieData | null>(null);
  const [lineData, setLineData] = useState<LineData | null>(null);
  const [incomeVsExpenseData, setIncomeVsExpenseData] = useState<LineData | null>(null);
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyNetBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverAvailable, setServerAvailable] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);
  const { theme } = useThemeStore();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();



  const getDefaultLineData = (): LineData => ({
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Total Expenses",
        data: [2500, 2800, 3200, 2900, 3500, 3800, 4200, 3900, 3600, 4000, 3800, 4200],
        borderColor: "rgb(5 150 105)",
        backgroundColor: "rgba(5 150 105 / 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  });

  const fetchMonthlySummary = useCallback(async () => {
    try {
      console.log(`Fetching monthly summary for ${currentYear}/${currentMonth}`);
      const response = await api.get<MonthlySummaryResponse>(
        `/api/expenses/expense-summary/${currentYear}/${currentMonth}`
      );
      const data = response.data;
      console.log('Monthly summary response:', data);

      const categories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Medicine",
        "Clothing",
        "Sanitary",
        "Educational",
        "Others",
      ];

      const categoryMap: Record<string, string> = {
        food: "Food",
        transport: "Transport",
        bills: "Bills",
        entertainment: "Entertainment",
        educational: "Educational",
        medicine: "Medicine",
        clothing: "Clothing",
        sanitary: "Sanitary",
        others: "Others",
      };

      const pieChartData: PieData = {
        labels: categories,
        datasets: [
          {
            label: "Monthly Expenses by Category",
            data: categories.map((cat) => {
              const found = data.summary.find(
                (item) => categoryMap[item.category.toLowerCase()] === cat
              );
              return found ? found.sum : 0;
            }),
            backgroundColor: [
              "#f87171",
              "#60a5fa",
              "#34d399",
              "#94a3b8",
              "#a78bfa",
              "#fb923c",
              "#f472b6",
              "#fbbf24",
              "#ffff24"
            ],
            borderColor: theme === 'dark' ? "#374151" : "#ffffff",
            borderWidth: 2,
            hoverOffset: 5,
          },
        ],
      };

      setPieData(pieChartData);
      setServerAvailable(true);
    } catch (err) {
      console.error("Error fetching monthly summary:", err);
      // Create default data inline to avoid dependency issues
      const defaultPieData: PieData = {
        labels: ["Food", "Transport", "Bills", "Entertainment", "Medicine", "Clothing", "Sanitary", "Educational", "Others"],
        datasets: [
          {
            label: "Monthly Expenses by Category",
            data: [1200, 800, 1500, 600, 400, 300, 200, 500, 100],
            backgroundColor: [
              "#f87171",
              "#60a5fa",
              "#34d399",
              "#94a3b8",
              "#a78bfa",
              "#fb923c",
              "#f472b6",
              "#fbbf24",
              "#ffff24"
            ],
            borderColor: theme === 'dark' ? "#374151" : "#ffffff",
            borderWidth: 2,
            hoverOffset: 5,
          },
        ],
      };
      setPieData(defaultPieData);
      setServerAvailable(false);
    }
  }, [currentYear, currentMonth, theme]);

  const fetchYearlyExpenses = useCallback(async () => {
    try {
      console.log(`Fetching yearly expenses for ${currentYear}`);
      const response = await api.get<YearlyExpensesResponse>(
        `/api/expenses/yearly-expenses/${currentYear}`
      );
      const data = response.data;
      console.log('Yearly expenses response:', data);

      const lineChartData: LineData = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Monthly Total Expenses",
            data: data.monthlyExpenses,
            borderColor: "rgb(5 150 105)",
            backgroundColor: "rgba(5 150 105 / 0.2)",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      };

      setLineData(lineChartData);
      setServerAvailable(true);
    } catch (err) {
      console.error("Error fetching yearly expenses:", err);
      setLineData(getDefaultLineData());
      setServerAvailable(false);
    }
  }, [currentYear]);

  const fetchMonthlyNetBalance = useCallback(async () => {
    try {
      console.log(`Fetching monthly net balance for ${currentYear}/${currentMonth}`);
      const response = await api.get<MonthlyNetBalanceResponse>(
        `/api/expenses/netbalance/${currentYear}/${currentMonth}`
      );
      const data = response.data;
      console.log('Monthly net balance response:', data);
      setMonthlyBalance(data);
    } catch (err) {
      console.error("Error fetching monthly net balance:", err);
      setMonthlyBalance(null);
    }
  }, [currentYear, currentMonth]);

  const fetchIncomeVsExpenseData = useCallback(async () => {
    try {
      console.log(`Fetching income vs expense data for ${currentYear}`);
      const response = await api.get(
        `/api/expenses/summary/june-2025`
      );
      const data = response.data;
      console.log('Income vs expense response:', data);

      interface MonthlyDataItem {
        month: string;
        income: number;
        expense: number;
      }

      const lineChartData: LineData = {
        labels: data.data.map((item: MonthlyDataItem) => item.month),
        datasets: [
          {
            label: "Income",
            data: data.data.map((item: MonthlyDataItem) => item.income),
            borderColor: "rgb(34 197 94)",
            backgroundColor: "rgba(34 197 94, 0.1)",
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: "Expenses",
            data: data.data.map((item: MonthlyDataItem) => item.expense),
            borderColor: "rgb(239 68 68)",
            backgroundColor: "rgba(239 68 68, 0.1)",
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      };

      setIncomeVsExpenseData(lineChartData);
    } catch (err) {
      console.error("Error fetching income vs expense data:", err);
      setIncomeVsExpenseData(null);
    }
  }, [currentYear]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchMonthlySummary(), 
          fetchYearlyExpenses(),
          fetchMonthlyNetBalance(),
          fetchIncomeVsExpenseData()
        ]);
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, refreshTrigger, fetchMonthlySummary, fetchYearlyExpenses, fetchMonthlyNetBalance, fetchIncomeVsExpenseData]);

  // Show a subtle refresh indicator when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      setShowRefreshIndicator(true);
      const timer = setTimeout(() => setShowRefreshIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className={`flex items-center justify-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Statistics -{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        {showRefreshIndicator && (
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'} border ${theme === 'dark' ? 'border-emerald-600' : 'border-emerald-200'}`}>
            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
              Updating...
            </span>
          </div>
        )}
      </div>

      {!serverAvailable && (
        <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
            ⚠️ Server not available. Showing sample data for demonstration.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Monthly Expenses by Category
          </h3>
          {pieData ? (
            <div className="w-full h-64 sm:h-80">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0
                          );
                          const percentage =
                            total > 0 ? Math.round((value / total) * 100) : 0;
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No data available
            </p>
          )}
        </div>

        <div className={`flex-1 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Yearly Expenses Overview ({currentYear})
          </h3>
          {lineData ? (
            <div className="w-full h-64 sm:h-80">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Amount (LKR)",
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      },
                      grid: {
                        color: theme === 'dark' ? '#374151' : '#e5e7eb',
                      },
                      ticks: {
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      },
                    },
                    x: {
                      grid: {
                        color: theme === 'dark' ? '#374151' : '#e5e7eb',
                      },
                      ticks: {
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No data available
            </p>
          )}
        </div>
      </div>

      {/* Financial Health Summary */}
      {monthlyBalance && (
        <div className={`mt-6 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Monthly Financial Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'} border ${theme === 'dark' ? 'border-green-600' : 'border-green-200'}`}>
              <div className="text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>Total Income</p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {monthlyBalance.totalIncome.toFixed(2)} LKR
                </p>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-600' : 'border-red-200'}`}>
              <div className="text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>Total Expenses</p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                  {monthlyBalance.totalExpense.toFixed(2)} LKR
                </p>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${monthlyBalance.netBalance >= 0 ? (theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50') : (theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50')} border ${monthlyBalance.netBalance >= 0 ? (theme === 'dark' ? 'border-emerald-600' : 'border-emerald-200') : (theme === 'dark' ? 'border-red-600' : 'border-red-200')}`}>
              <div className="text-center">
                <p className={`text-sm ${monthlyBalance.netBalance >= 0 ? (theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600') : (theme === 'dark' ? 'text-red-300' : 'text-red-600')}`}>Net Balance</p>
                <p className={`text-xl font-bold ${monthlyBalance.netBalance >= 0 ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700') : (theme === 'dark' ? 'text-red-400' : 'text-red-700')}`}>
                  {monthlyBalance.netBalance >= 0 ? '+' : ''}{monthlyBalance.netBalance.toFixed(2)} LKR
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income vs Expenses Chart */}
      {incomeVsExpenseData && (
        <div className={`mt-6 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Income vs Expenses Trend
          </h3>
          <div className="w-full h-64 sm:h-80">
            <Line
              data={incomeVsExpenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Amount (LKR)",
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    },
                    grid: {
                      color: theme === 'dark' ? '#374151' : '#e5e7eb',
                    },
                    ticks: {
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    },
                  },
                  x: {
                    grid: {
                      color: theme === 'dark' ? '#374151' : '#e5e7eb',
                    },
                    ticks: {
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Financial Insights */}
      <div className={`mt-6 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>💡 Tips for Better Financial Health</h4>
            <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Track every expense, no matter how small</li>
              <li>• Set monthly budget limits for each category</li>
              <li>• Review your spending patterns weekly</li>
              <li>• Aim to save at least 20% of your income</li>
              <li>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            </ul>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>📊 Key Metrics</h4>
            <div className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="flex justify-between">
                <span>Savings Rate:</span>
                <span className="font-semibold">
                  {monthlyBalance ? Math.round(((monthlyBalance.netBalance) / monthlyBalance.totalIncome) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expense Ratio:</span>
                <span className="font-semibold">
                  {monthlyBalance ? Math.round((monthlyBalance.totalExpense / monthlyBalance.totalIncome) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Financial Status:</span>
                <span className={`font-semibold ${monthlyBalance && monthlyBalance.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monthlyBalance && monthlyBalance.netBalance >= 0 ? 'Healthy' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
