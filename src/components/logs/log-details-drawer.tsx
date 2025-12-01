"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  SaveIcon,
  ServerIcon,
  TagIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/context";
import { authEnabled } from "@/lib/config/auth";
import { SeverityLevel } from "@/lib/enums/severity";
import { useUpdateLog } from "@/lib/hooks/query/use-logs";
import type { LogResponse } from "@/lib/types/log";
import { updateLogValidator } from "@/lib/validators/log";

interface LogDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogResponse | null;
  onDelete?: (log: LogResponse) => void;
}

export function LogDetailsDrawer({
  open,
  onOpenChange,
  log,
  onDelete,
}: LogDetailsDrawerProps) {
  const { user } = useAuth();
  const isAuthenticated = !authEnabled || !!user;

  const [formData, setFormData] = useState({
    message: log?.message || "",
    severity: log?.severity || SeverityLevel.INFO,
    source: log?.source || "",
    timestamp: log?.timestamp
      ? (() => {
          const date = new Date(log.timestamp);
          return Number.isNaN(date.getTime()) ? "" : date.toISOString();
        })()
      : "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateLogMutation = useUpdateLog();

  // Validate individual field
  const validateField = (fieldName: string, value: unknown) => {
    const fieldValidator =
      updateLogValidator.shape[
        fieldName as keyof typeof updateLogValidator.shape
      ];
    if (fieldValidator) {
      const result = fieldValidator.safeParse(value);
      if (!result.success) {
        setFieldErrors((prev) => ({
          ...prev,
          [fieldName]: result.error.issues[0]?.message || "Invalid value",
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Reset form when log ID changes (new log selected)
  useEffect(() => {
    if (log) {
      const timeoutId = setTimeout(() => {
        const isoTimestamp =
          log.timestamp && log.timestamp instanceof Date
            ? log.timestamp.toISOString()
            : log.timestamp
              ? new Date(log.timestamp).toISOString()
              : "";
        setFormData({
          message: log.message,
          severity: log.severity,
          source: log.source,
          timestamp: isoTimestamp,
        });
        setFieldErrors({}); // Clear any previous errors
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [log]);

  if (!log) return null;

  const handleSave = async () => {
    // Validate the form data first
    const validationResult = updateLogValidator.safeParse(formData);

    if (!validationResult.success) {
      // Set field-level errors
      const newFieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          newFieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(newFieldErrors);

      // Show validation errors
      const errors = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      toast.error(`Please fix the following errors: ${errors}`);
      return;
    } else {
      // Clear errors if validation passes
      setFieldErrors({});
    }

    try {
      const originalTimestamp =
        log.timestamp instanceof Date
          ? log.timestamp.toISOString()
          : log.timestamp;

      const parsedTimestamp =
        formData.timestamp &&
        !Number.isNaN(new Date(formData.timestamp).getTime())
          ? new Date(formData.timestamp)
          : undefined;

      await updateLogMutation.mutateAsync({
        id: log.id,
        data: {
          message:
            formData.message !== log.message ? formData.message : undefined,
          severity:
            formData.severity !== log.severity ? formData.severity : undefined,
          source: formData.source !== log.source ? formData.source : undefined,
          timestamp:
            formData.timestamp && formData.timestamp !== originalTimestamp
              ? parsedTimestamp
              : undefined,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update log:", error);
    }
  };

  const handleDelete = () => {
    onDelete?.(log);
    onOpenChange(false);
  };

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Basic Information
            </h3>

            {/* ID */}
            <div className="flex items-center space-x-3">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                <span className="font-mono text-xs">#</span>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Log ID</div>
                <div className="font-mono text-sm">{log.id}</div>
              </div>
            </div>

            {/* Severity */}
            <div className="flex items-start space-x-3">
              <div className="mt-6 flex h-5 w-5 items-center justify-center rounded bg-muted">
                <TagIcon className="h-3 w-3" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-muted-foreground text-xs">
                  Severity Level
                </div>
                <Select
                  disabled={!isAuthenticated}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      severity: value as SeverityLevel,
                    }));
                    validateField("severity", value);
                  }}
                  value={formData.severity}
                >
                  <SelectTrigger
                    className={`w-40 ${fieldErrors.severity ? "border-destructive" : ""}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SeverityLevel).map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.severity && (
                  <div className="text-destructive text-sm">
                    {fieldErrors.severity}
                  </div>
                )}
              </div>
            </div>

            {/* Source */}
            <div className="flex items-start space-x-3">
              <div className="mt-6 flex h-5 w-5 items-center justify-center rounded bg-muted">
                <ServerIcon className="h-3 w-3" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-muted-foreground text-xs">Source</div>
                <Input
                  className={`max-w-xs ${fieldErrors.source ? "border-destructive" : ""}`}
                  disabled={!isAuthenticated}
                  onBlur={() => validateField("source", formData.source)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      source: e.target.value,
                    }));
                    validateField("source", e.target.value);
                  }}
                  placeholder="e.g., api-server, database, auth-service"
                  value={formData.source}
                />
                {fieldErrors.source && (
                  <div className="text-destructive text-sm">
                    {fieldErrors.source}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Timestamps
            </h3>

            {/* Log Timestamp */}
            <div className="flex items-start space-x-3">
              <div className="mt-6 flex h-5 w-5 items-center justify-center rounded bg-muted">
                <ClockIcon className="h-3 w-3" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-muted-foreground text-xs">
                  Occurrence time
                </div>
                <Input
                  className={`max-w-xs ${fieldErrors.timestamp ? "border-destructive" : ""}`}
                  disabled={!isAuthenticated}
                  onBlur={() => validateField("timestamp", formData.timestamp)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const newTimestamp = Number.isNaN(date.getTime())
                      ? ""
                      : date.toISOString();
                    setFormData((prev) => ({
                      ...prev,
                      timestamp: newTimestamp,
                    }));
                    validateField("timestamp", newTimestamp);
                  }}
                  type="datetime-local"
                  value={
                    formData.timestamp
                      ? (() => {
                          const date = new Date(formData.timestamp);
                          return Number.isNaN(date.getTime())
                            ? ""
                            : date.toISOString().slice(0, 16);
                        })()
                      : ""
                  }
                />
                {fieldErrors.timestamp && (
                  <div className="text-destructive text-sm">
                    {fieldErrors.timestamp}
                  </div>
                )}
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center space-x-3">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                <CalendarIcon className="h-3 w-3" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Created At</div>
                <div className="font-mono text-sm">
                  {log.createdAt
                    ? format(
                        new Date(log.createdAt),
                        "MMM dd, yyyy 'at' HH:mm:ss",
                      )
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Message
            </h3>
            <div className="space-y-2">
              <Textarea
                className={`min-h-24 font-mono text-sm ${fieldErrors.message ? "border-destructive" : ""}`}
                disabled={!isAuthenticated}
                onBlur={() => validateField("message", formData.message)}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, message: e.target.value }));
                  validateField("message", e.target.value);
                }}
                placeholder="Enter log message..."
                value={formData.message}
              />
              <div className="flex items-center justify-between">
                <div>
                  {fieldErrors.message && (
                    <div className="text-destructive text-sm">
                      {fieldErrors.message}
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground text-xs">
                  {formData.message.length}/1000
                </div>
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex-row justify-end">
          <div className="flex space-x-2">
            <Button
              onClick={onOpenChange.bind(null, false)}
              size="sm"
              variant="outline"
            >
              Close
            </Button>
            <Button
              disabled={!isAuthenticated || updateLogMutation.isPending}
              onClick={handleSave}
              size="sm"
              variant="default"
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              {updateLogMutation.isPending ? "Saving..." : "Save"}
            </Button>
            {onDelete && (
              <Button onClick={handleDelete} size="sm" variant="destructive">
                Delete
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
