"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "ranksniper/components/ui/card";
import { Radar } from "recharts";

interface PerformanceOverviewProps {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export function PerformanceOverview({ scores }: PerformanceOverviewProps) {
  const data = {
    labels: ["Performance", "Accessibility", "Best Practices", "SEO"],
    datasets: [
      {
        label: "Scores",
        data: [
          scores.performance * 100,
          scores.accessibility * 100,
          scores.bestPractices * 100,
          scores.seo * 100,
        ],
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <Radar data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
