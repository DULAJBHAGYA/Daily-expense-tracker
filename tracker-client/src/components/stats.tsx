import React, { useEffect, useState } from "react";
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

const Stats = () => {
  const [pieData, setPieData] = useState<PieData | null>(null);
  const [lineData, setLineData] = useState<LineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverAvailable, setServerAvailable] = useState(true);
  const { theme } = useThemeStore();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Default data for when server is not available
  const getDefaultPieData = (): PieData => ({
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
  });

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

  const fetchMonthlySummary = async () => {
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
      setPieData(getDefaultPieData());
      setServerAvailable(false);
      setError("Server not available - showing sample data");
    }
  };

  const fetchYearlyExpenses = async () => {
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
      setError("Server not available - showing sample data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchMonthlySummary(), fetchYearlyExpenses()]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentYear, currentMonth, theme]);

  if (loading) {
    return (
      <div className={`p-4 sm:p-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        Statistics -{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h3>

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
    </div>
  );
};

export default Stats;
