"use client";

import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
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
import { useDebouncedSearch } from "@/lib/hooks/utils/use-debounced-search";
import type {
  SeverityFilter,
  SortByField,
  SortOrder,
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
}: LogsFiltersProps) {
  const { searchValue, setSearchValue } = useDebouncedSearch(
    searchQuery,
    onSearchQueryChange,
    { delay: 300 },
  );

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
          <div className="flex-1 lg:flex-[2]">
            <div className="relative">
              <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pr-9 pl-9"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search logs..."
                value={searchValue}
              />
              {searchValue && (
                <Button
                  className="absolute top-0.5 right-1 h-8 w-8 cursor-pointer p-0 hover:bg-transparent"
                  onClick={() => setSearchValue("")}
                  size="sm"
                  variant="ghost"
                >
                  <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
