import { subDays } from "date-fns";
import type {
  FilterAllOption,
  GroupBy,
  SeverityFilter,
  SourceFilter,
} from "@/lib/types/filters";
import { api, type RouterOutputs } from "@/trpc/server";
import { DashboardClient } from "./dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    severity?: string;
    source?: string;
    groupBy?: GroupBy;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const defaultDateRange = {
    from: subDays(new Date(), 7),
    to: new Date(),
  };

  const startDate = params.startDate
    ? new Date(params.startDate)
    : defaultDateRange.from;
  const endDate = params.endDate
    ? new Date(params.endDate)
    : defaultDateRange.to;

  const initialFilters = {
    dateRange: {
      from: startDate,
      to: endDate,
    },
    selectedSeverity:
      (params.severity as SeverityFilter) || ("all" as FilterAllOption),
    selectedSource:
      (params.source as SourceFilter) || ("all" as FilterAllOption),
    timeGrouping: (params.groupBy as GroupBy) || ("day" as GroupBy),
  };

  const severityFilter =
    initialFilters.selectedSeverity &&
    initialFilters.selectedSeverity !== ("all" as FilterAllOption)
      ? initialFilters.selectedSeverity
      : undefined;

  const sourceFilter =
    initialFilters.selectedSource &&
    initialFilters.selectedSource !== ("all" as FilterAllOption)
      ? initialFilters.selectedSource
      : undefined;

  const aggregationInput = {
    startDate,
    endDate,
    severity: severityFilter,
    source: sourceFilter,
  };

  const chartInput = {
    ...aggregationInput,
    groupBy: initialFilters.timeGrouping,
  };

  // Fetch all data in parallel using allSettled - one failure doesn't block others
  const [aggregationResponse, chartDataResponse, metadataResponse] =
    await Promise.allSettled([
      api.logs.getAggregation(aggregationInput),
      api.logs.getChartData(chartInput),
      api.logs.getMetadata(),
    ]);

  // Extract data from settled promises with fallback to undefined
  const initialData: {
    aggregationData?: RouterOutputs["logs"]["getAggregation"];
    timeSeriesData?: RouterOutputs["logs"]["getChartData"];
    metadata?: RouterOutputs["logs"]["getMetadata"];
  } = {
    aggregationData:
      aggregationResponse.status === "fulfilled"
        ? aggregationResponse.value
        : undefined,
    timeSeriesData:
      chartDataResponse.status === "fulfilled"
        ? chartDataResponse.value
        : undefined,
    metadata:
      metadataResponse.status === "fulfilled"
        ? metadataResponse.value
        : undefined,
  };

  // Collect error messages for client-side toasts
  const prefetchErrors: string[] = [];

  if (aggregationResponse.status === "rejected") {
    const message =
      aggregationResponse.reason instanceof Error
        ? aggregationResponse.reason.message
        : "Failed to load aggregation data";
    prefetchErrors.push(message);
    console.error(
      "Failed to fetch aggregation data:",
      aggregationResponse.reason,
    );
  }
  if (chartDataResponse.status === "rejected") {
    const message =
      chartDataResponse.reason instanceof Error
        ? chartDataResponse.reason.message
        : "Failed to load chart data";
    prefetchErrors.push(message);
    console.error("Failed to fetch chart data:", chartDataResponse.reason);
  }
  if (metadataResponse.status === "rejected") {
    const message =
      metadataResponse.reason instanceof Error
        ? metadataResponse.reason.message
        : "Failed to load metadata";
    prefetchErrors.push(message);
    console.error("Failed to fetch metadata:", metadataResponse.reason);
  }

  return (
    <DashboardClient
      initialData={initialData}
      initialFilters={initialFilters}
      prefetchErrors={prefetchErrors.length > 0 ? prefetchErrors : undefined}
    />
  );
}
