import { subDays } from "date-fns";
import type {
  FilterAllOption,
  GroupBy,
  SeverityFilter,
  SourceFilter,
} from "@/lib/types/filters";
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

  return <DashboardClient initialFilters={initialFilters} />;
}
