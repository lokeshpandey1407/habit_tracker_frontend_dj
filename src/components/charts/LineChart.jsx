import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import Loader from "../loader/Loader";

// Register the noData plugin
ChartJS.register({
  id: "noData",
  afterDatasetsDraw: (chart, args, options) => {
    const {
      ctx,
      data,
      chartArea: { left, top, right, bottom },
    } = chart;
    if (data?.datasets[0]?.data?.length === 0) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(left, top, right - left, bottom - top);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "26px";
      ctx.fillText("No data available", (left + right) / 2, (top + bottom) / 2);
      ctx.restore();
    }
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);
const LineChart = ({ data, loading }) => {
  const mainData = {
    labels: data?.time,
    datasets: [
      {
        label: "Apparent Temp Max",
        data: data?.apparent_temperature_max,
        backgroundColor: "#6976EB",
        borderWidth: 2,
        borderColor: "#6976EB",
        tension: 0.3,
        borderSkipped: false,
      },
      {
        label: "Apparent Temp Min",
        data: data?.apparent_temperature_min,
        backgroundColor: "#2B3695",
        borderWidth: 2,
        borderColor: "#2B3695",
        tension: 0.3,
        borderSkipped: false,
      },
      {
        label: "Apparent Temp Mean",
        data: data?.apparent_temperature_mean,
        backgroundColor: "#ff5733",
        borderWidth: 2,
        borderColor: "#ff5733",
        tension: 0.3,
        borderSkipped: false,
      },
      {
        label: "Temperature Max",
        data: data?.temperature_2m_max,
        backgroundColor: "#ffdd33",
        borderWidth: 2,
        borderColor: "#ffdd33",
        tension: 0.3,
        borderSkipped: false,
      },
      {
        label: "Temperature Min",
        data: data?.temperature_2m_min,
        backgroundColor: "#7dff33",
        borderWidth: 2,
        borderColor: "#7dff33",
        tension: 0.3,
        borderSkipped: false,
      },
      {
        label: "Temperature Mean",
        data: data?.temperature_2m_mean,
        backgroundColor: "#33b2ff",
        borderWidth: 2,
        borderColor: "#33b2ff",
        tension: 0.3,
        borderSkipped: false,
      },
    ],
  };

  const noData = {
    id: "noData",
    afterDatasetsDraw: (chart, args, options) => {
      const {
        ctx,
        data,
        chartArea: { left, top, right, bottom },
      } = chart;
      ctx.fillStyle = "#666";
      ctx, fillRect(left, top, right, bottom);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px 'Helvetica Neue'";
      ctx.fillText("No data available", (left + width) / 2, (bottom - top) / 2);
      ctx.save();
      ctx.restore();
    },
  };

  const mainOptions = {
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        noData: true,
        align: "center",
        onHover: (event) => {
          event.chart.canvas.style.cursor = "pointer";
        },
        onLeave: (event) => {
          event.chart.canvas.style.cursor = "";
        },
        labels: {
          color: "#666",
          usePointStyle: true,
          pointStyle: "rectRounded",
          font: { size: 14, weight: "bold" },
        },
      },
      title: {
        display: false,
        text: "Temperature Graph",
        position: "top",
        align: "start",
        font: { weight: "bold", size: 20 },
      },
      noData,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
            lineHeight: 1.2,
          },
          padding: { top: 10, left: 0, right: 0, bottom: 20 },
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature",
          font: {
            size: 14,
            weight: "bold",
            lineHeight: 1.2,
          },
          padding: { top: 10, left: 0, right: 0, bottom: 0 },
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };
  return (
    <div>
      <h2>Temperature Graph</h2>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Line options={mainOptions} data={mainData} />
      )}
    </div>
  );
};

export default LineChart;
