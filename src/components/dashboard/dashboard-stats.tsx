"use client";

import { format } from "date-fns";
import {
  AlertTriangleIcon,
  BugIcon,
  InfoIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryError } from "@/components/ui/error-boundary";
import { LoadingState } from "@/components/ui/loading-state";
import { StatsCard } from "@/components/ui/stats-card";
import { SeverityLevel } from "@/lib/enums/severity";
import type { LogAggregationResponse } from "@/lib/types/log";

const SEVERITY_ICONS = {
  [SeverityLevel.DEBUG]: BugIcon,
  [SeverityLevel.INFO]: InfoIcon,
  [SeverityLevel.WARNING]: AlertTriangleIcon,
  [SeverityLevel.ERROR]: AlertTriangleIcon,
  [SeverityLevel.CRITICAL]: AlertTriangleIcon,
};

interface DashboardStatsProps {
  aggregationData?: LogAggregationResponse;
  isLoading: boolean;
  error?: unknown;
  dateRange?: DateRange;
  onResetFilters: () => void;
}

export function DashboardStats({
  aggregationData,
  isLoading,
  error,
  dateRange,
  onResetFilters,
}: DashboardStatsProps) {
  if (isLoading) {
    return <LoadingState count={4} variant="cards" />;
  }

  if (error) {
    return (
      <QueryError error={error} title="Failed to load dashboard statistics" />
    );
  }

  if (!aggregationData) {
    return (
      <EmptyState
        action={{ label: "Reset Filters", onClick: onResetFilters }}
        description="Please adjust your filters and try again"
        title="No aggregation data available"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        description={`${dateRange?.from ? format(dateRange.from, "MMM dd") : ""} - ${dateRange?.to ? format(dateRange.to, "MMM dd") : ""}`}
        icon={<TrendingUpIcon className="h-4 w-4" />}
        title="Total Logs"
        value={aggregationData.totalLogs.toLocaleString()}
      />

      {aggregationData.bySeverity.slice(0, 3).map((item) => {
        const Icon = SEVERITY_ICONS[item.severity as SeverityLevel];
        const percentage =
          aggregationData.totalLogs > 0
            ? ((item.count / aggregationData.totalLogs) * 100).toFixed(1)
            : "0";

        return (
          <StatsCard
            description={`${percentage}% of total logs`}
            icon={<Icon className="h-4 w-4" />}
            key={item.severity}
            title={`${item.severity} Logs`}
            value={item.count.toLocaleString()}
          />
        );
      })}
    </div>
  );
}
