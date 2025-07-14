"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ranksniper/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "ranksniper/components/ui/chart";

interface PerformanceBarChartProps {
  metrics: {
    FCP: number;
    LCP: number;
    TBT: number;
    CLS: number;
    TTI: number;
  };
}

const chartConfig = {
  FCP: {
    label: "First Contentful Paint",
    color: "var(--chart-1)", // blue
  },
  LCP: {
    label: "Largest Contentful Paint",
    color: "var(--chart-2)", // green
  },
  TBT: {
    label: "Total Blocking Time",
    color: "var(--chart-3)", // purple
  },
  CLS: {
    label: "Cumulative Layout Shift",
    color: "var(--chart-4)", // amber
  },
  TTI: {
    label: "Time to Interactive",
    color: "var(--chart-5)", // red
  },
} satisfies ChartConfig;

export function PerformanceBarChart({ metrics }: PerformanceBarChartProps) {
  // Transform metrics into chart data
  const chartData = [
    {
      name: "Metrics",
      FCP: metrics.FCP / 1000,
      LCP: metrics.LCP / 1000,
      TBT: metrics.TBT / 1000,
      CLS: metrics.CLS,
      TTI: metrics.TTI / 1000,
    },
  ];

  // Calculate average for trend
  const totalTime = Object.values(metrics).reduce((acc, curr) => acc + curr, 0);
  const avgTime = totalTime / Object.keys(metrics).length;
  const trend = avgTime < 3000 ? "down" : "up";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Distribution of core web vitals</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={chartData}
            width={500}
            margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${value === 0 ? "" : "s"}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}${name === "CLS" ? "" : "s"}`,
                    chartConfig[name as keyof typeof chartConfig].label,
                  ]}
                />
              }
            />
            {Object.keys(chartConfig).map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={chartConfig[metric as keyof typeof chartConfig].color}
                radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey={metric}
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  formatter={(value: number) =>
                    `${value.toFixed(2)}${metric === "CLS" ? "" : "s"}`
                  }
                />
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Performance trend: {trend === "down" ? "Faster" : "Slower"} than
          average{" "}
          <TrendingUp
            className={`h-4 w-4 ${trend === "down" ? "rotate-180" : ""}`}
          />
        </div>
        <div className="text-muted-foreground leading-none">
          Average timing: {(avgTime / 1000).toFixed(2)}s
        </div>
      </CardFooter>
    </Card>
  );
}
