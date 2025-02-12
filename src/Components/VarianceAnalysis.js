import React from "react";
import "./VarianceAnalysis.css";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

function VarianceAnalysis({ chartData }) {
  return (
    <div className="line-graph-container">
      <h2>Variance Analysis</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#ff7f0e"
              strokeWidth={3}
              name="Budget"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2ca02c"
              strokeWidth={3}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="variance"
              stroke="#d62728"
              strokeWidth={3}
              name="Variance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VarianceAnalysis;
