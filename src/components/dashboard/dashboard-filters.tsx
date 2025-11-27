"use client";

import { FilterIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { SeverityLevel } from "@/lib/enums/severity";
import type { MetadataResponse } from "@/lib/types/common";
import type {
  GroupBy,
  SeverityFilter,
  SourceFilter,
} from "@/lib/types/filters";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  selectedSeverity: SeverityFilter;
  onSeverityChange: (severity: SeverityFilter) => void;
  selectedSource: SourceFilter;
  onSourceChange: (source: SourceFilter) => void;
  timeGrouping: GroupBy;
  onTimeGroupingChange: (grouping: GroupBy) => void;
  metadata?: MetadataResponse;
  onResetFilters: () => void;
}

export function DashboardFilters({
  dateRange,
  onDateRangeChange,
  selectedSeverity,
  onSeverityChange,
  selectedSource,
  onSourceChange,
  timeGrouping,
  onTimeGroupingChange,
  metadata,
  onResetFilters,
}: DashboardFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">Filters</CardTitle>
            <CardDescription>
              Select date range, severity, and source to filter log data
            </CardDescription>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={onResetFilters}
            size="sm"
            variant="outline"
          >
            <FilterIcon className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row">
          <DateRangePicker
            className="w-full lg:w-auto"
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            placeholder="Select date range"
          />

          <Select onValueChange={onSeverityChange} value={selectedSeverity}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {Object.values(SeverityLevel).map((level) => (
                <SelectItem key={level} value={level}>
                  <div className="flex items-center gap-2">
                    <SeverityBadge className="text-xs" severity={level} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={onSourceChange} value={selectedSource}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {metadata?.sources?.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              )) || []}
            </SelectContent>
          </Select>

          <Select onValueChange={onTimeGroupingChange} value={timeGrouping}>
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Hour</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
