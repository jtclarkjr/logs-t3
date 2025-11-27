"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onExportCsv: () => void;
  isExporting: boolean;
}

export function DashboardHeader({
  onExportCsv,
  isExporting,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-bold text-3xl">Logs Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and analyze your application logs with detailed insights
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex items-center gap-2"
          disabled={isExporting}
          onClick={onExportCsv}
        >
          <DownloadIcon className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>
    </div>
  );
}
