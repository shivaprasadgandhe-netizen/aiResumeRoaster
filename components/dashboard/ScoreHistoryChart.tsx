"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

export interface ScoreDataPoint {
  date: string;
  score: number;
  fileName: string;
}

interface ScoreHistoryChartProps {
  data: ScoreDataPoint[];
}

export function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-neutral-100 dark:bg-charcoal-850 rounded-2xl animate-pulse" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 text-center text-neutral-500">
        <TrendingUp className="w-8 h-8 text-neutral-400 mb-2" />
        <p className="text-sm font-semibold">No Resume History Yet</p>
        <p className="text-xs">Upload your first resume to chart your score improvements over time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-flame-500" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Score Progression Over Time
          </h3>
        </div>
        <span className="text-xs text-neutral-500">0 - 100 Scale</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#888888" }}
              axisLine={{ stroke: "#88888830" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#888888" }}
              axisLine={{ stroke: "#88888830" }}
              tickLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as ScoreDataPoint;
                  return (
                    <div className="bg-neutral-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 border border-neutral-700">
                      <p className="font-bold text-flame-400">{d.score}/100</p>
                      <p className="text-neutral-300 font-medium truncate max-w-[180px]">
                        {d.fileName}
                      </p>
                      <p className="text-neutral-500 text-[10px]">{d.date}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
