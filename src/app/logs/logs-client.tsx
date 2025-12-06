"use client";

import { useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { CreateLogDialog } from "@/components/logs/create/create-log-dialog";
import { DeleteLogDialog } from "@/components/logs/delete/delete-log-dialog";
import { LogDetailsDrawer } from "@/components/logs/log-details-drawer";
import { LogsFilters } from "@/components/logs/logs-filters";
import { LogsHeader } from "@/components/logs/logs-header";
import { LogsPagination } from "@/components/logs/logs-pagination";
import { LogsTable } from "@/components/logs/logs-table";
import { SpotlightSearch } from "@/components/logs/spotlight-search";
import { authEnabled } from "@/lib/config/auth";
import {
  useDeleteLog,
  useExportLogs,
  useLogs,
} from "@/lib/hooks/query/use-logs";
import { useLogsFilters } from "@/lib/hooks/state/use-logs-filters";
import { useLogsUIState } from "@/lib/hooks/state/use-logs-ui-state";
import { useAuthAction } from "@/lib/hooks/use-auth-action";
import { useSpotlightSearch } from "@/lib/hooks/utils/use-spotlight-search";
import type {
  SeverityFilter,
  SortByField,
  SortOrder,
  SourceFilter,
  UserFilter,
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
    createdByFilter?: UserFilter;
    updatedByFilter?: UserFilter;
  };
  prefetchError?: string;
}

export function LogsClient({
  initialData,
  initialFilters = {},
  prefetchError,
}: LogsClientProps) {
  // Show error toast if initial data fetch failed
  useEffect(() => {
    if (prefetchError) {
      toast.error(prefetchError);
    }
  }, [prefetchError]);

  // Auth protection
  const { requireAuth, AuthModalComponent, user } = useAuthAction();
  const currentUserId = user?.id;
  const isDeleteEnabled = !authEnabled || !!user;

  // Spotlight search state
  const { isOpen: spotlightOpen, setIsOpen: setSpotlightOpen } =
    useSpotlightSearch();

  // Filter state management
  const {
    searchQuery,
    selectedSeverity,
    sortBy,
    sortOrder,
    dateRange,
    createdByFilter,
    updatedByFilter,
    setSearchQuery,
    setSelectedSeverity,
    setDateRange,
    setCreatedByFilter,
    setUpdatedByFilter,
    handleSortChange,
    setCurrentPage,
    setPageSize,
    resetFilters,
    getAPIFilters,
  } = useLogsFilters(initialFilters, currentUserId ?? undefined);

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

  // Use current data or fall back to initial data
  const displayLogs: LogListResponse | undefined = logs ?? initialData;

  // Wrapped handlers that require auth
  const handleCreateLog = () => {
    requireAuth(() => openCreateDialog());
  };

  const handleDeleteLog = (log: NonNullable<typeof displayLogs>["logs"][0]) => {
    // When delete is disabled, this shouldn't be called
    // But keep requireAuth as safety measure for any edge cases
    if (!isDeleteEnabled) return;
    openDeleteDialog(log);
  };

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

  const handleExport = () => {
    const filters = getAPIFilters();
    void exportLogs(filters);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <LogsHeader
        isExporting={isExporting}
        onCreateLog={handleCreateLog}
        onExport={handleExport}
      />

      {/* Filters */}
      <LogsFilters
        createdByFilter={createdByFilter}
        dateRange={dateRange}
        onCreatedByFilterChange={setCreatedByFilter}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
        onSearchQueryChange={setSearchQuery}
        onSeverityChange={setSelectedSeverity}
        onSortChange={handleSortChange}
        onSpotlightClick={() => setSpotlightOpen(true)}
        onUpdatedByFilterChange={setUpdatedByFilter}
        searchQuery={searchQuery}
        selectedSeverity={selectedSeverity}
        showUserFilters={Boolean(currentUserId)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        updatedByFilter={updatedByFilter}
      />

      {/* Results */}
      <LogsTable
        error={error}
        isDeleteEnabled={isDeleteEnabled}
        isLoading={isLoading}
        logs={displayLogs}
        onDeleteLog={handleDeleteLog}
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
        onDelete={handleDeleteLog}
        onOpenChange={closeLogDetails}
        open={drawerOpen}
      />

      {/* Create Log Dialog */}
      <CreateLogDialog
        onOpenChange={closeCreateDialog}
        open={createDialogOpen}
      />

      {/* Spotlight Search */}
      <SpotlightSearch
        onOpenChange={setSpotlightOpen}
        onSearchQueryChange={setSearchQuery}
        open={spotlightOpen}
        searchQuery={searchQuery}
      />

      {/* Auth Modal */}
      <AuthModalComponent />
    </div>
  );
}
