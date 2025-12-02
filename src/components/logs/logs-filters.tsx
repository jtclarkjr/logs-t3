"use client";

import { FilterIcon, SearchIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityLevel } from "@/lib/enums/severity";
import type {
  SeverityFilter,
  SortByField,
  SortOrder,
  UserFilter,
} from "@/lib/types/filters";

interface LogsFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  selectedSeverity: SeverityFilter;
  onSeverityChange: (severity: SeverityFilter) => void;
  sortBy: SortByField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortByField, sortOrder: SortOrder) => void;
  onResetFilters: () => void;
  showUserFilters: boolean;
  createdByFilter: UserFilter;
  updatedByFilter: UserFilter;
  onCreatedByFilterChange: (filter: UserFilter) => void;
  onUpdatedByFilterChange: (filter: UserFilter) => void;
  onSpotlightClick?: () => void;
}

export function LogsFilters({
  searchQuery,
  onSearchQueryChange,
  dateRange,
  onDateRangeChange,
  selectedSeverity,
  onSeverityChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  showUserFilters,
  createdByFilter,
  updatedByFilter,
  onCreatedByFilterChange,
  onUpdatedByFilterChange,
  onSpotlightClick,
}: LogsFiltersProps) {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onSortChange(field as SortByField, order as SortOrder);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search and filter logs by various criteria
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
          {/* Search */}
          <div className="w-[500px] flex-1 lg:flex-[2]">
            <button
              className="relative w-full cursor-pointer text-left"
              onClick={onSpotlightClick}
              type="button"
            >
              <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pr-24 pl-9"
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search logs..."
                readOnly
                value={searchQuery}
              />
              <div className="pointer-events-none absolute top-2 right-3 flex items-center gap-1">
                <kbd className="inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground">
                  <span className="text-xs">⌘K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Date Range */}
          <div className="flex-1 lg:flex-[2]">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
              placeholder="Select date range"
            />
          </div>

          {/* Severity */}
          <div className="w-full lg:w-48">
            <Select onValueChange={onSeverityChange} value={selectedSeverity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {Object.values(SeverityLevel).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <Select
              onValueChange={handleSortChange}
              value={`${sortBy}-${sortOrder}`}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp-desc">Newest First</SelectItem>
                <SelectItem value="timestamp-asc">Oldest First</SelectItem>
                <SelectItem value="severity-desc">Severity ↓</SelectItem>
                <SelectItem value="severity-asc">Severity ↑</SelectItem>
                <SelectItem value="source-desc">Source ↓</SelectItem>
                <SelectItem value="source-asc">Source ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created/Updated By */}
          {showUserFilters && (
            <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto">
              <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                <input
                  checked={createdByFilter === "me"}
                  className="h-4 w-4 accent-primary"
                  name="createdByMe"
                  onChange={(e) =>
                    onCreatedByFilterChange(e.target.checked ? "me" : "all")
                  }
                  type="checkbox"
                />
                Created by me
              </label>
              <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                <input
                  checked={updatedByFilter === "me"}
                  className="h-4 w-4 accent-primary"
                  name="updatedByMe"
                  onChange={(e) =>
                    onUpdatedByFilterChange(e.target.checked ? "me" : "all")
                  }
                  type="checkbox"
                />
                Updated by me
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
