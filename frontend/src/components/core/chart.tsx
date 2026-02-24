"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useSettingsStore } from "@/store/useSettingsStore";

// Type definitions for various chart data
type ChartData = {
  name: string;
  value: number;
  [key: string]: any;
};

interface BaseChartProps {
  data: ChartData[];
  dataKey: string;
  name?: string;
  stroke?: string;
  fill?: string;
  syncId?: string;
  gridColor?: string;
  hideAxis?: boolean;
}

interface LineChartProps extends BaseChartProps {
  type: "line";
}

interface AreaChartProps extends BaseChartProps {
  type: "area";
}

interface BarChartProps extends BaseChartProps {
  type: "bar";
}

type GenericChartProps = LineChartProps | AreaChartProps | BarChartProps;

export const Chart: React.FC<GenericChartProps> = ({
  data,
  dataKey,
  name,
  stroke = "var(--primary)",
  fill = "var(--primary)",
  syncId,
  gridColor = "var(--border)",
  hideAxis = false,
  type,
  ...props
}) => {
  const { theme } = useSettingsStore();
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const axisColor = isDarkMode ? "oklch(80% 0.01 250)" : "oklch(30% 0.03 250)"; // Adjusted for theme
  const legendColor = isDarkMode ? "oklch(80% 0.01 250)" : "oklch(30% 0.03 250)";

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {!hideAxis && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {!hideAxis && <XAxis dataKey="name" stroke={axisColor} />}
            {!hideAxis && <YAxis stroke={axisColor} />}
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "oklch(15% 0.03 250)" : "oklch(100% 0 0)",
                borderColor: isDarkMode ? "oklch(25% 0.02 250)" : "oklch(90% 0.01 250)",
                borderRadius: "8px",
                color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)",
              }}
              itemStyle={{ color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)" }}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} name={name || dataKey} {...props} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {!hideAxis && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {!hideAxis && <XAxis dataKey="name" stroke={axisColor} />}
            {!hideAxis && <YAxis stroke={axisColor} />}
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "oklch(15% 0.03 250)" : "oklch(100% 0 0)",
                borderColor: isDarkMode ? "oklch(25% 0.02 250)" : "oklch(90% 0.01 250)",
                borderRadius: "8px",
                color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)",
              }}
              itemStyle={{ color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)" }}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Area type="monotone" dataKey={dataKey} stroke={stroke} fill={fill} name={name || dataKey} {...props} />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={data} syncId={syncId} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {!hideAxis && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {!hideAxis && <XAxis dataKey="name" stroke={axisColor} />}
            {!hideAxis && <YAxis stroke={axisColor} />}
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "oklch(15% 0.03 250)" : "oklch(100% 0 0)",
                borderColor: isDarkMode ? "oklch(25% 0.02 250)" : "oklch(90% 0.01 250)",
                borderRadius: "8px",
                color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)",
              }}
              itemStyle={{ color: isDarkMode ? "oklch(90% 0.01 250)" : "oklch(15% 0.03 250)" }}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Bar dataKey={dataKey} fill={fill} name={name || dataKey} {...props} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};
