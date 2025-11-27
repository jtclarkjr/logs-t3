"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants/pagination";
import type { LogListResponse } from "@/lib/types/log";

interface LogsPaginationProps {
  logs?: LogListResponse;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function LogsPagination({
  logs,
  onPageChange,
  onPageSizeChange,
}: LogsPaginationProps) {
  if (!logs) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-4">
        <div className="text-muted-foreground text-sm">
          Showing {(logs.page - 1) * logs.pageSize + 1} to{" "}
          {Math.min(logs.page * logs.pageSize, logs.total)} of{" "}
          {logs.total.toLocaleString()} results
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Show:</span>
          <select
            className="rounded border border-input bg-background px-2 py-1 text-sm"
            onChange={(e) =>
              onPageSizeChange ? onPageSizeChange(Number(e.target.value)) : null
            }
            value={logs.pageSize}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          disabled={logs.page <= 1}
          onClick={() => onPageChange(1)}
          size="sm"
          variant="outline"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={logs.page <= 1}
          onClick={() => onPageChange(logs.page - 1)}
          size="sm"
          variant="outline"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, logs.totalPages) }, (_, i) => {
            const pageNum = Math.max(1, logs.page - 2) + i;
            if (pageNum > logs.totalPages) return null;

            return (
              <Button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                size="sm"
                variant={pageNum === logs.page ? "default" : "outline"}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          disabled={logs.page >= logs.totalPages}
          onClick={() => onPageChange(logs.page + 1)}
          size="sm"
          variant="outline"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={logs.page >= logs.totalPages}
          onClick={() => onPageChange(logs.totalPages)}
          size="sm"
          variant="outline"
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
