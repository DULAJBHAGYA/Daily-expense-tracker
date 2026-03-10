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
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/utils/api";

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

  // Individual loading states for each section
  const [pieLoading, setPieLoading] = useState(false);
  const [lineLoading, setLineLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // State for user-selected dates
  const [selectedPieMonth, setSelectedPieMonth] = useState(currentMonth);
  const [selectedPieYear, setSelectedPieYear] = useState(currentYear);
  const [selectedExpenseYear, setSelectedExpenseYear] = useState(currentYear);
  const [selectedTrendYear, setSelectedTrendYear] = useState(currentYear);
  const [selectedBalanceMonth, setSelectedBalanceMonth] = useState(currentMonth);
  const [selectedBalanceYear, setSelectedBalanceYear] = useState(currentYear);



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
    setPieLoading(true);
    try {
      console.log(`Fetching monthly summary for ${selectedPieYear}/${selectedPieMonth}`);
      const response = await api.get<MonthlySummaryResponse>(
        `/api/expenses/expense-summary/${selectedPieYear}/${selectedPieMonth}`
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
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 5,
          },
        ],
      };

      setPieData(pieChartData);
      setServerAvailable(true);
    } catch (err) {
      setPieLoading(false);
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
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 5,
          },
        ],
      };
      setPieData(defaultPieData);
      setServerAvailable(false);
    } finally {
      setPieLoading(false);
    }
  }, [selectedPieYear, selectedPieMonth]);

  const fetchYearlyExpenses = useCallback(async () => {
    setLineLoading(true);
    try {
      console.log(`Fetching yearly expenses for ${selectedExpenseYear}`);
      const response = await api.get<YearlyExpensesResponse>(
        `/api/expenses/yearly-expenses/${selectedExpenseYear}`
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
    } finally {
      setLineLoading(false);
    }
  }, [selectedExpenseYear]);

  const fetchMonthlyNetBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      console.log(`Fetching monthly net balance for ${selectedBalanceYear}/${selectedBalanceMonth}`);
      const response = await api.get<MonthlyNetBalanceResponse>(
        `/api/expenses/netbalance/${selectedBalanceYear}/${selectedBalanceMonth}`
      );
      const data = response.data;
      console.log('Monthly net balance response:', data);
      setMonthlyBalance(data);
    } catch (err) {
      console.error("Error fetching monthly net balance:", err);
      setMonthlyBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, [selectedBalanceYear, selectedBalanceMonth]);

  const fetchIncomeVsExpenseData = useCallback(async () => {
    setTrendLoading(true);
    try {
      console.log(`Fetching income vs expense data for ${selectedTrendYear}`);
      const response = await api.get(
        `/api/expenses/income-expense-by-year/${selectedTrendYear}`
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
    } finally {
      setTrendLoading(false);
    }
  }, [selectedTrendYear]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial load - fetch all data once
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Separate useEffect for pie chart - only refetch when pie chart dates change
  useEffect(() => {
    if (!mounted) return;
    fetchMonthlySummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPieMonth, selectedPieYear, mounted]);

  // Separate useEffect for yearly expenses - only refetch when expense year changes
  useEffect(() => {
    if (!mounted) return;
    fetchYearlyExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpenseYear, mounted]);

  // Separate useEffect for monthly balance - only refetch when balance dates change
  useEffect(() => {
    if (!mounted) return;
    fetchMonthlyNetBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBalanceMonth, selectedBalanceYear, mounted]);

  // Separate useEffect for income vs expense trend - only refetch when trend year changes
  useEffect(() => {
    if (!mounted) return;
    fetchIncomeVsExpenseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrendYear, mounted]);

  // Refresh all data when refreshTrigger changes (from parent component)
  useEffect(() => {
    if (!mounted || refreshTrigger === 0) return;
    
    setShowRefreshIndicator(true);
    
    Promise.all([
      fetchMonthlySummary(), 
      fetchYearlyExpenses(),
      fetchMonthlyNetBalance(),
      fetchIncomeVsExpenseData()
    ]).then(() => {
      const timer = setTimeout(() => setShowRefreshIndicator(false), 2000);
      return () => clearTimeout(timer);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, mounted]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2 text-gray-700">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Statistics 
        </h2>
        {showRefreshIndicator && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-3 h-3 border-2 border-[#15994e] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-[#15994e]">
              Updating...
            </span>
          </div>
        )}
      </div>

      {!serverAvailable && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Server not available. Showing sample data for demonstration.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-4 rounded-2xl bg-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Expenses by Category
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPieMonth}
                onChange={(e) => setSelectedPieMonth(Number(e.target.value))}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[#15994e] focus:border-[#15994e]"
              >
                {Array.from(
                  { length: selectedPieYear === currentYear ? currentMonth : 12 }, 
                  (_, i) => i + 1
                ).map((month) => (
                  <option key={month} value={month}>
                    {new Date(selectedPieYear, month - 1).toLocaleDateString("en-US", { month: "short" })}
                  </option>
                ))}
              </select>
              <select
                value={selectedPieYear}
                onChange={(e) => {
                  const newYear = Number(e.target.value);
                  setSelectedPieYear(newYear);
                  // Reset month to current if switching to current year and selected month is in future
                  if (newYear === currentYear && selectedPieMonth > currentMonth) {
                    setSelectedPieMonth(currentMonth);
                  }
                }}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[#15994e] focus:border-[#15994e]"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {pieLoading ? (
            <div className="flex items-center justify-center h-64 sm:h-80">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-[#15994e] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          ) : pieData ? (
            <div className="w-full h-64 sm:h-80">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#374151',
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
            <p className="text-center text-gray-500">
              No data available
            </p>
          )}
        </div>

        <div className="flex-1 p-4 rounded-2xl bg-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedExpenseYear(selectedExpenseYear - 1)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Previous Year"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              Yearly Expenses Overview - {selectedExpenseYear}
            </h3>
            <button
              onClick={() => setSelectedExpenseYear(selectedExpenseYear + 1)}
              disabled={selectedExpenseYear >= currentYear}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Year"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          {lineLoading ? (
            <div className="flex items-center justify-center h-64 sm:h-80">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-[#15994e] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          ) : lineData ? (
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
                        color: '#374151',
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Amount (LKR)",
                        color: '#374151',
                      },
                      grid: {
                        color: '#e5e7eb',
                      },
                      ticks: {
                        color: '#374151',
                      },
                    },
                    x: {
                      grid: {
                        color: '#e5e7eb',
                      },
                      ticks: {
                        color: '#374151',
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No data available
            </p>
          )}
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="mt-6 p-4 rounded-2xl bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Financial Summary
          </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedBalanceMonth}
                onChange={(e) => setSelectedBalanceMonth(Number(e.target.value))}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[#15994e] focus:border-[#15994e]"
              >
                {Array.from(
                  { length: selectedBalanceYear === currentYear ? currentMonth : 12 }, 
                  (_, i) => i + 1
                ).map((month) => (
                  <option key={month} value={month}>
                    {new Date(selectedBalanceYear, month - 1).toLocaleDateString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={selectedBalanceYear}
                onChange={(e) => {
                  const newYear = Number(e.target.value);
                  setSelectedBalanceYear(newYear);
                  // Reset month to current if switching to current year and selected month is in future
                  if (newYear === currentYear && selectedBalanceMonth > currentMonth) {
                    setSelectedBalanceMonth(currentMonth);
                  }
                }}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-[#15994e] focus:border-[#15994e]"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {balanceLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-[#15994e] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyBalance && (
              <>
            <div className="p-3 rounded-xl bg-green-50">
              <div className="text-center">
                <p className="text-sm text-[#15994e]">Total Income</p>
                <p className="text-xl font-bold text-[#15994e]">
                  {monthlyBalance.totalIncome.toFixed(2)} LKR
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-50">
              <div className="text-center">
                <p className="text-sm text-red-700">Total Expenses</p>
                <p className="text-xl font-bold text-red-700">
                  {monthlyBalance.totalExpense.toFixed(2)} LKR
                </p>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${monthlyBalance.netBalance >= 0 ? 'bg-emerald-50' : 'bg-red-50'} `}>
              <div className="text-center">
                <p className={`text-sm ${monthlyBalance.netBalance >= 0 ? 'text-[#15994e]' : 'text-red-700'}`}>Net Balance</p>
                <p className={`text-xl font-bold ${monthlyBalance.netBalance >= 0 ? 'text-[#15994e]' : 'text-red-700'}`}>
                  {monthlyBalance.netBalance >= 0 ? '+' : ''}{monthlyBalance.netBalance.toFixed(2)} LKR
                </p>
              </div>
            </div>
              </>
            )}
            {!monthlyBalance && (
              <div className="col-span-3 text-center text-gray-500 py-4">
                No data available
              </div>
            )}
          </div>
          )}
        </div>

      {/* Income vs Expenses Chart */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedTrendYear(selectedTrendYear - 1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Previous Year"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            Income vs Expenses Trend - {selectedTrendYear}
          </h3>
          <button
            onClick={() => setSelectedTrendYear(selectedTrendYear + 1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Next Year"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {trendLoading ? (
          <div className="flex items-center justify-center h-64 sm:h-80">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-[#15994e] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        ) : incomeVsExpenseData ? (
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
                      color: '#374151',
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Amount (LKR)",
                      color: '#374151',
                    },
                    grid: {
                      color: '#e5e7eb',
                    },
                    ticks: {
                      color: '#374151',
                    },
                  },
                  x: {
                    grid: {
                      color: '#e5e7eb',
                    },
                    ticks: {
                      color: '#374151',
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No data available
          </p>
        )}
      </div>

      {/* Financial Insights */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 ">
            <h4 className="font-semibold mb-2 text-gray-900">Tips for Better Financial Health</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Track every expense, no matter how small</li>
              <li>• Set monthly budget limits for each category</li>
              <li>• Review your spending patterns weekly</li>
              <li>• Aim to save at least 20% of your income</li>
              <li>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 ">
            <h4 className="font-semibold mb-2 text-gray-900">Key Metrics</h4>
            <div className="text-sm space-y-2 text-gray-600">
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
                <span className={`font-semibold ${monthlyBalance && monthlyBalance.netBalance >= 0 ? 'text-[#15994e]' : 'text-red-700'}`}>
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
