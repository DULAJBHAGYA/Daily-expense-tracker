import React from 'react'
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

const Stats = () => {
  const pieData = {
    labels: ["Food", "Transport", "Entertainment", "Bills", "Others"],
    datasets: [
      {
        label: "Monthly Expenses by Category",
        data: [500, 200, 150, 300, 100],
        backgroundColor: [
          "#f87171", // red-400 food
          "#60a5fa", // blue-400 transport
          "#fbbf24", // yellow-400 entertainment
          "#34d399", // green-400 bills
          "#a78bfa", // purple-400 others
        ],
        hoverOffset: 20,
      },
    ],
  };

  const lineData = {
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
        data: [
          1200, 1100, 1400, 1300, 1250, 1500, 1600, 1700, 1600, 1550, 1400,
          1500,
        ],
        borderColor: "rgb(5 150 105)",
        backgroundColor: "rgb(5 190 105)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };
  
  return (
    <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                  Statistics
                </h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-6 sm:space-y-0">
                <div className="flex-1 max-w-md mx-auto md:max-w-none md:mx-0">
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    Monthly Expenses by Category
                  </h3>
                  <Pie data={pieData} />
                </div>

                <div className="flex-1 max-w-md mx-auto md:max-w-none md:mx-0">
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    Monthly Total Expenses
                  </h3>
                  <Line data={lineData} />
                </div>
              </div>
            </div>
  )
}

export default Stats
