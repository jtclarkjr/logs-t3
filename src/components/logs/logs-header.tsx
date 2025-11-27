"use client";

import { Download, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogsHeaderProps {
  onCreateLog: () => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function LogsHeader({
  onCreateLog,
  onExport,
  isExporting = false,
}: LogsHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-bold text-3xl">Logs</h1>
        <p className="text-muted-foreground">
          Search, filter, and manage your application logs
        </p>
      </div>
      <div className="flex gap-2">
        {onExport ? (
          <Button
            className="flex items-center gap-2"
            disabled={isExporting}
            onClick={onExport}
            variant="secondary"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        ) : null}
        <Button className="flex items-center gap-2" onClick={onCreateLog}>
          <PlusIcon className="h-4 w-4" />
          Create Log
        </Button>
      </div>
    </div>
  );
}
