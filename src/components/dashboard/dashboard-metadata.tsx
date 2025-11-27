"use client";

import { format } from "date-fns";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QueryError } from "@/components/ui/error-boundary";
import type { MetadataResponse } from "@/lib/types/common";

interface DashboardMetadataProps {
  metadata?: MetadataResponse;
  isLoading: boolean;
  error?: unknown;
}

export function DashboardMetadata({
  metadata,
  isLoading,
  error,
}: DashboardMetadataProps) {
  if (error) {
    return <QueryError error={error} title="Failed to load metadata" />;
  }

  if (!metadata || isLoading) {
    return null;
  }

  const totalLogs =
    metadata.totalLogs !== undefined
      ? metadata.totalLogs.toLocaleString()
      : "N/A";

  const sourcesCount = metadata.sources?.length ?? 0;
  const earliest = metadata.dateRange?.earliest
    ? format(new Date(metadata.dateRange.earliest), "MMM dd, yyyy")
    : "N/A";
  const latest = metadata.dateRange?.latest
    ? format(new Date(metadata.dateRange.latest), "MMM dd, yyyy")
    : "N/A";

  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        Dashboard showing data from {totalLogs} total logs across{" "}
        {sourcesCount.toLocaleString()} sources. Data range: {earliest} to{" "}
        {latest}
      </AlertDescription>
    </Alert>
  );
}
