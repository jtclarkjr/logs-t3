"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryError } from "@/components/ui/error-boundary";
import { LoadingState } from "@/components/ui/loading-state";
import type { LogAggregationResponse } from "@/lib/types/log";

interface TopSourcesChartProps {
  aggregationData?: LogAggregationResponse;
  isLoading: boolean;
  error?: unknown;
}

export function TopSourcesChart({
  aggregationData,
  isLoading,
  error,
}: TopSourcesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Log Sources</CardTitle>
        <CardDescription>
          Most active log sources in the selected time period
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState variant="chart" />
        ) : error ? (
          <QueryError error={error} title="Failed to load source data" />
        ) : aggregationData?.bySource.length ? (
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={aggregationData.bySource.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  angle={-45}
                  dataKey="source"
                  height={80}
                  textAnchor="end"
                />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            description="No logs found for the selected filters"
            title="No source data available"
          />
        )}
      </CardContent>
    </Card>
  );
}
