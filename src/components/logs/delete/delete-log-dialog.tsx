"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { LogResponse } from "@/lib/types/log";

interface DeleteLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logToDelete: LogResponse | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function DeleteLogDialog({
  open,
  onOpenChange,
  logToDelete,
  onConfirmDelete,
  isDeleting,
}: DeleteLogDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Log</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this log? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {logToDelete && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={logToDelete.severity} />
                <Badge variant="outline">{logToDelete.source}</Badge>
              </div>
              <p className="font-mono text-sm">
                {format(
                  new Date(logToDelete.timestamp),
                  "MMM dd, yyyy HH:mm:ss",
                )}
              </p>
              <p className="text-sm">{logToDelete.message}</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting}
            onClick={onConfirmDelete}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
