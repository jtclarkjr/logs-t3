"use client";

import { useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { SeverityDistributionChart } from "@/components/dashboard/chart/chart-severity-distribution";
import { TimelineChart } from "@/components/dashboard/chart/chart-timeline";
import { TopSourcesChart } from "@/components/dashboard/chart/chart-top-sources";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardMetadata } from "@/components/dashboard/dashboard-metadata";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useExportLogs,
  useFormattedChartData,
  useLogAggregation,
  useMetadata,
} from "@/lib/hooks/query/use-logs";
import { useDashboardFilters } from "@/lib/hooks/state/use-dashboard-filters";
import type { ChartDataResponse } from "@/lib/types/chart";
import type { MetadataResponse } from "@/lib/types/common";
import type {
  GroupBy,
  SeverityFilter,
  SourceFilter,
} from "@/lib/types/filters";
import type { LogAggregationResponse } from "@/lib/types/log";

interface DashboardClientProps {
  initialData?: {
    aggregationData?: LogAggregationResponse;
    timeSeriesData?: ChartDataResponse;
    metadata?: MetadataResponse;
  };
  initialFilters?: {
    dateRange?: DateRange;
    selectedSeverity?: SeverityFilter;
    selectedSource?: SourceFilter;
    timeGrouping?: GroupBy;
  };
  prefetchErrors?: string[];
}

export function DashboardClient({
  initialData,
  initialFilters = {},
  prefetchErrors,
}: DashboardClientProps) {
  // Show error toasts if initial data fetches failed
  useEffect(() => {
    if (prefetchErrors && prefetchErrors.length > 0) {
      for (const error of prefetchErrors) {
        toast.error(error);
      }
    }
  }, [prefetchErrors]);
  // Filter state management
  const {
    dateRange,
    selectedSeverity,
    selectedSource,
    timeGrouping,
    setDateRange,
    setSelectedSeverity,
    setSelectedSource,
    setTimeGrouping,
    resetFilters,
    getAggregationFilters,
    getChartDataFilters,
    getExportFilters,
    getExportFilename,
    canExport,
  } = useDashboardFilters(initialFilters);

  // Data queries
  const {
    data: aggregationData,
    isLoading: isLoadingAggregation,
    error: aggregationError,
  } = useLogAggregation(getAggregationFilters(), initialData?.aggregationData);

  const {
    data: timeSeriesData,
    isLoading: isLoadingChart,
    error: chartError,
  } = useFormattedChartData(
    getChartDataFilters(),
    timeGrouping,
    initialData?.timeSeriesData,
  );

  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useMetadata(initialData?.metadata);

  const exportLogsMutation = useExportLogs();

  const handleExportCsv = () => {
    if (!canExport) {
      toast.error("Please select a date range");
      return;
    }

    const filters = getExportFilters();
    if (!filters) {
      toast.error("Invalid date range");
      return;
    }

    exportLogsMutation.mutate({
      filters,
      filename: getExportFilename(),
    });
  };

  // Use current data or fall back to initial data
  const displayAggregationData: LogAggregationResponse | undefined =
    (aggregationData as LogAggregationResponse | undefined) ??
    initialData?.aggregationData;
  const displayTimeSeriesData = timeSeriesData || [];
  const displayMetadata = metadata || initialData?.metadata;

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <DashboardHeader
        isExporting={exportLogsMutation.isPending}
        onExportCsv={handleExportCsv}
      />

      {/* Filters Panel */}
      <DashboardFilters
        dateRange={dateRange}
        metadata={displayMetadata}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
        onSeverityChange={setSelectedSeverity}
        onSourceChange={setSelectedSource}
        onTimeGroupingChange={setTimeGrouping}
        selectedSeverity={selectedSeverity}
        selectedSource={selectedSource}
        timeGrouping={timeGrouping}
      />

      {/* Stats Overview */}
      <DashboardStats
        aggregationData={displayAggregationData}
        dateRange={dateRange}
        error={aggregationError}
        isLoading={isLoadingAggregation}
        onResetFilters={resetFilters}
      />

      {/* Charts Section */}
      <Tabs className="space-y-4" defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline Chart</TabsTrigger>
          <TabsTrigger value="distribution">Severity Distribution</TabsTrigger>
          <TabsTrigger value="sources">Top Sources</TabsTrigger>
        </TabsList>

        {/* Timeline Chart */}
        <TabsContent value="timeline">
          <TimelineChart
            error={chartError}
            isLoading={isLoadingChart}
            timeGrouping={timeGrouping}
            timeSeriesData={displayTimeSeriesData || []}
          />
        </TabsContent>

        {/* Severity Distribution */}
        <TabsContent value="distribution">
          <SeverityDistributionChart
            aggregationData={displayAggregationData}
            error={aggregationError}
            isLoading={isLoadingAggregation}
          />
        </TabsContent>

        {/* Top Sources */}
        <TabsContent value="sources">
          <TopSourcesChart
            aggregationData={displayAggregationData}
            error={aggregationError}
            isLoading={isLoadingAggregation}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Info Alert */}
      <DashboardMetadata
        error={metadataError}
        isLoading={isLoadingMetadata}
        metadata={displayMetadata}
      />
    </div>
  );
}
