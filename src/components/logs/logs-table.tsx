"use client";

import { format } from "date-fns";
import { EyeIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryError } from "@/components/ui/error-boundary";
import { FadeTransition } from "@/components/ui/fade-transition";
import { LoadingState } from "@/components/ui/loading-state";
import { SeverityBadge } from "@/components/ui/severity-badge";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";
import type { LogListResponse, LogResponse } from "@/lib/types/log";

interface LogsTableProps {
  logs?: LogListResponse;
  isLoading: boolean;
  error?: unknown;
  onViewLog: (log: LogResponse) => void;
  onDeleteLog: (log: LogResponse) => void;
  onResetFilters: () => void;
}

export function LogsTable({
  logs,
  isLoading,
  error,
  onViewLog,
  onDeleteLog,
  onResetFilters,
}: LogsTableProps) {
  // Calculate skeleton row count based on actual data or default page size
  const skeletonRowCount =
    logs?.logs?.length || logs?.pageSize || DEFAULT_PAGE_SIZE;

  return (
    <Card className="mb-0">
      <CardContent>
        {isLoading ? (
          <LoadingState count={skeletonRowCount} variant="table" />
        ) : error ? (
          <QueryError error={error} title="Failed to load logs" />
        ) : !logs || logs.logs.length === 0 ? (
          <EmptyState
            action={{
              label: "Reset Filters",
              onClick: onResetFilters,
            }}
            description="Try adjusting your search criteria or filters"
            title="No logs found"
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <FadeTransition
                as="tbody"
                className="[&_tr:last-child]:border-0"
                data-slot="table-body"
                duration="fast"
                isVisible={!isLoading}
              >
                {logs.logs.map((log) => (
                  <TableRow
                    className="fade-in-0 animate-in duration-200"
                    key={log.id}
                  >
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={log.severity} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.source}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onViewLog(log)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteLog(log)}>
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive">
                              Delete
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </FadeTransition>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
