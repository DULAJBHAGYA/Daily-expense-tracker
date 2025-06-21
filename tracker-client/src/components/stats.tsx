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

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchMonthlySummary = async () => {
    try {
      const response = await api.get<MonthlySummaryResponse>(
        `/expense-summary/${currentYear}/${currentMonth}`
      );
      const data = response.data;

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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load monthly data";
      setError(errorMessage);
      console.error("Error fetching monthly summary:", err);
    }
  };

  const fetchYearlyExpenses = async () => {
    try {
      const response = await api.get<YearlyExpensesResponse>(
        `/yearly-expenses/${currentYear}`
      );
      const data = response.data;

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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load yearly data";
      setError(errorMessage);
      console.error("Error fetching yearly expenses:", err);
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
  }, [currentYear, currentMonth]);

  if (loading) {
    return <div className="p-6">Loading statistics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Statistics -{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black mb-4 text-center">
            Monthly Expenses by Category
          </h3>
          {pieData ? (
            <Pie
              data={pieData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed || 0; // Use context.parsed instead of context.raw for Pie chart
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
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center text-black">
            Yearly Expenses Overview ({currentYear})
          </h3>
          {lineData ? (
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Amount (LKR)",
                    },
                  },
                },
              }}
            />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
