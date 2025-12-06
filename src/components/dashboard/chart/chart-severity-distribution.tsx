"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
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
import { Progress } from "@/components/ui/progress";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { SeverityLevel } from "@/lib/enums/severity";
import type { RouterOutputs } from "@/trpc/react";

const SEVERITY_COLORS = {
  [SeverityLevel.DEBUG]: "#6b7280",
  [SeverityLevel.INFO]: "#3b82f6",
  [SeverityLevel.WARNING]: "#f59e0b",
  [SeverityLevel.ERROR]: "#ef4444",
  [SeverityLevel.CRITICAL]: "#dc2626",
};

interface SeverityDistributionChartProps {
  aggregationData?: RouterOutputs["logs"]["getAggregation"];
  isLoading: boolean;
  error?: unknown;
}

export function SeverityDistributionChart({
  aggregationData,
  isLoading,
  error,
}: SeverityDistributionChartProps) {
  const severityDistribution =
    aggregationData?.bySeverity.map((item) => ({
      name: item.severity,
      value: item.count,
      color: SEVERITY_COLORS[item.severity as SeverityLevel],
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Distribution</CardTitle>
        <CardDescription>Breakdown of logs by severity level</CardDescription>
      </CardHeader>
      <CardContent>
        {(() => {
          if (isLoading) {
            return <LoadingState variant="chart" />;
          }

          if (error) {
            return (
              <QueryError error={error} title="Failed to load severity data" />
            );
          }

          if (severityDistribution.length === 0) {
            return (
              <EmptyState
                description="No logs found for the selected filters"
                title="No severity data available"
              />
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ResponsiveContainer height={320} width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={severityDistribution}
                    dataKey="value"
                    label={({ name, percent }) => {
                      const percentValue =
                        typeof percent === "number"
                          ? (percent * 100).toFixed(0)
                          : 0;
                      return `${name} ${percentValue}%`;
                    }}
                    outerRadius={100}
                  >
                    {severityDistribution.map(
                      (entry: (typeof severityDistribution)[number]) => (
                        <Cell fill={entry.color} key={entry.name} />
                      ),
                    )}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                <h4 className="font-medium">Severity Breakdown</h4>
                {aggregationData?.bySeverity.map((item) => {
                  const hasLogs = aggregationData.totalLogs > 0;
                  const percentage = hasLogs
                    ? ((item.count / aggregationData.totalLogs) * 100).toFixed(
                        1,
                      )
                    : "0";

                  return (
                    <div className="space-y-2" key={item.severity}>
                      <div className="flex items-center justify-between">
                        <SeverityBadge
                          severity={item.severity as SeverityLevel}
                        />
                        <span className="font-medium text-sm">
                          {item.count.toLocaleString()} ({percentage}%)
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={parseFloat(percentage)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
