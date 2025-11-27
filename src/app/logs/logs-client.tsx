"use client";

import type { DateRange } from "react-day-picker";
import { CreateLogDialog } from "@/components/logs/create/create-log-dialog";
import { DeleteLogDialog } from "@/components/logs/delete/delete-log-dialog";
import { LogDetailsDrawer } from "@/components/logs/log-details-drawer";
import { LogsFilters } from "@/components/logs/logs-filters";
import { LogsHeader } from "@/components/logs/logs-header";
import { LogsPagination } from "@/components/logs/logs-pagination";
import { LogsTable } from "@/components/logs/logs-table";
import {
  useDeleteLog,
  useExportLogs,
  useLogs,
} from "@/lib/hooks/query/use-logs";
import { useLogsFilters } from "@/lib/hooks/state/use-logs-filters";
import { useLogsUIState } from "@/lib/hooks/state/use-logs-ui-state";
import type {
  SeverityFilter,
  SortByField,
  SortOrder,
  SourceFilter,
} from "@/lib/types/filters";
import type { LogListResponse } from "@/lib/types/log";

interface LogsClientProps {
  initialData?: LogListResponse;
  initialFilters?: {
    searchQuery?: string;
    selectedSeverity?: SeverityFilter;
    selectedSource?: SourceFilter;
    sortBy?: SortByField;
    sortOrder?: SortOrder;
    currentPage?: number;
    dateRange?: DateRange;
  };
}

export function LogsClient({
  initialData,
  initialFilters = {},
}: LogsClientProps) {
  // Filter state management
  const {
    searchQuery,
    selectedSeverity,
    sortBy,
    sortOrder,
    dateRange,
    setSearchQuery,
    setSelectedSeverity,
    setDateRange,
    handleSortChange,
    setCurrentPage,
    setPageSize,
    resetFilters,
    getAPIFilters,
  } = useLogsFilters(initialFilters);

  // UI state management
  const {
    deleteDialogOpen,
    logToDelete,
    drawerOpen,
    selectedLog,
    createDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    openLogDetails,
    closeLogDetails,
    openCreateDialog,
    closeCreateDialog,
  } = useLogsUIState();

  // React Query hooks - use computed filters from hook
  const { data: logs, isLoading, error } = useLogs(getAPIFilters());
  const deleteLogMutation = useDeleteLog();
  const { exportLogs, isPending: isExporting } = useExportLogs();

  const confirmDeleteLog = () => {
    if (!logToDelete) return;

    deleteLogMutation.mutate(
      { id: logToDelete.id },
      {
        onSuccess: () => {
          closeDeleteDialog();
        },
      },
    );
  };

  // Use current data or fall back to initial data
  const displayLogs: LogListResponse | undefined = logs ?? initialData;

  const handleExport = () => {
    const filters = getAPIFilters();
    void exportLogs(filters);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <LogsHeader
        isExporting={isExporting}
        onCreateLog={openCreateDialog}
        onExport={handleExport}
      />

      {/* Filters */}
      <LogsFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
        onSearchQueryChange={setSearchQuery}
        onSeverityChange={setSelectedSeverity}
        onSortChange={handleSortChange}
        searchQuery={searchQuery}
        selectedSeverity={selectedSeverity}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {/* Results */}
      <LogsTable
        error={error}
        isLoading={isLoading}
        logs={displayLogs}
        onDeleteLog={openDeleteDialog}
        onResetFilters={resetFilters}
        onViewLog={openLogDetails}
      />

      {/* Pagination */}
      <LogsPagination
        logs={displayLogs}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteLogDialog
        isDeleting={deleteLogMutation.isPending}
        logToDelete={logToDelete}
        onConfirmDelete={confirmDeleteLog}
        onOpenChange={closeDeleteDialog}
        open={deleteDialogOpen}
      />

      {/* Log Details Drawer */}
      <LogDetailsDrawer
        log={selectedLog}
        onDelete={openDeleteDialog}
        onOpenChange={closeLogDetails}
        open={drawerOpen}
      />

      {/* Create Log Dialog */}
      <CreateLogDialog
        onOpenChange={closeCreateDialog}
        open={createDialogOpen}
      />
    </div>
  );
}
