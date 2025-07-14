"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "ranksniper/components/ui/card";

interface PerformanceMetersProps {
  scores: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
}

const scoreConfig = {
  performance: {
    label: "Performance",
    color: "#2563eb", // blue
    gradientFrom: "#93c5fd",
    gradientTo: "#2563eb",
    description: "Page load performance score",
  },
  accessibility: {
    label: "Accessibility",
    color: "#10b981", // green
    gradientFrom: "#6ee7b7",
    gradientTo: "#10b981",
    description: "Web accessibility score",
  },
  bestPractices: {
    label: "Best Practices",
    color: "#8b5cf6", // purple
    gradientFrom: "#c4b5fd",
    gradientTo: "#8b5cf6",
    description: "Web development best practices",
  },
  seo: {
    label: "SEO",
    color: "#f59e0b", // amber
    gradientFrom: "#fcd34d",
    gradientTo: "#f59e0b",
    description: "Search engine optimization score",
  },
};

function CircularMeter({
  value,
  config,
}: {
  value: number;
  config: (typeof scoreConfig)[keyof typeof scoreConfig];
}) {
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke={config.color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color: config.color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

export function PerformanceMeters({ scores }: PerformanceMetersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lighthouse Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(scores).map(([key, value]) => {
            const score = Math.round((value || 0) * 100);
            const config = scoreConfig[key as keyof typeof scoreConfig];

            return (
              <div key={key} className="flex flex-col items-center gap-4">
                <CircularMeter value={score} config={config} />
                <div className="text-center space-y-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {config.label}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
