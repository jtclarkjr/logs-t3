"use client";

import { useForm } from "@tanstack/react-form";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormFieldWrapper } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Textarea } from "@/components/ui/textarea";
import { SeverityLevel } from "@/lib/enums/severity";
import { useCreateLog } from "@/lib/hooks/query/use-logs";
import { createLogValidator } from "@/lib/validators/log";

type CreateLogFormData = z.infer<typeof createLogValidator>;

interface CreateLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLogDialog({ open, onOpenChange }: CreateLogDialogProps) {
  const createLogMutation = useCreateLog();

  const form = useForm({
    defaultValues: {
      severity: SeverityLevel.INFO,
      source: "",
      message: "",
    } as CreateLogFormData,
    validators: {
      onSubmit: createLogValidator,
    },
    onSubmit: async ({ value: formData }) => {
      // Use current time (no buffer to prevent "future timestamp" error)
      const now = new Date();

      const submitData = {
        ...formData,
        timestamp: now,
      };

      await new Promise<void>((resolve, reject) => {
        createLogMutation.mutate(submitData, {
          onSuccess: () => {
            toast.success("Log created successfully!");
            handleClose();
            resolve();
          },
          onError: (error) => {
            const normalizedError =
              error instanceof Error
                ? error
                : new Error("Failed to create log entry");
            reject(normalizedError);
          },
        });
      });
    },
  });

  const handleClose = () => {
    // Reset form
    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Log</DialogTitle>
          <DialogDescription>
            Fill in the details for the new log entry
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* Severity */}
          <form.Field name="severity">
            {(field) => (
              <FormFieldWrapper
                errors={(field.state.meta.errors || [])
                  .filter(Boolean)
                  .map(String)}
                label="Severity Level"
                required
              >
                <Select
                  onValueChange={(value: SeverityLevel) =>
                    field.handleChange(value)
                  }
                  value={field.state.value}
                >
                  <SelectTrigger
                    className={
                      field.state.meta.errors.length > 0
                        ? "border-destructive"
                        : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SeverityLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={level} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          </form.Field>

          {/* Source */}
          <form.Field
            name="source"
            validators={{
              onBlur: ({ value }) => {
                // Only validate if the user has entered something or tried to leave empty
                if (!value || value.trim() === "") {
                  return "Source is required";
                }
                const result = createLogValidator.shape.source.safeParse(value);
                return !result.success
                  ? result.error.issues[0]?.message
                  : undefined;
              },
            }}
          >
            {(field) => (
              <FormFieldWrapper
                description="The system or component that generated this log"
                errors={(field.state.meta.errors || [])
                  .filter(Boolean)
                  .map(String)}
                label="Source"
                required
              >
                <Input
                  className={
                    field.state.meta.errors.length > 0
                      ? "border-destructive"
                      : ""
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., api-server, database, auth-service"
                  value={field.state.value}
                />
              </FormFieldWrapper>
            )}
          </form.Field>

          {/* Message */}
          <form.Field
            name="message"
            validators={{
              onBlur: ({ value }) => {
                // Only validate if the user has entered something or tried to leave empty
                if (!value || value.trim() === "") {
                  return "Message is required";
                }
                const result =
                  createLogValidator.shape.message.safeParse(value);
                return !result.success
                  ? result.error.issues[0]?.message
                  : undefined;
              },
            }}
          >
            {(field) => (
              <FormFieldWrapper
                errors={(field.state.meta.errors || [])
                  .filter(Boolean)
                  .map(String)}
                label="Message"
                required
              >
                <Textarea
                  className={
                    field.state.meta.errors.length > 0
                      ? "border-destructive"
                      : ""
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter the log message..."
                  rows={4}
                  value={field.state.value}
                />
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    The log message content
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {field.state.value.length}/1000
                  </p>
                </div>
              </FormFieldWrapper>
            )}
          </form.Field>

          {/* Preview */}
          <form.Subscribe>
            {({ values }: { values: CreateLogFormData }) =>
              values.source &&
              values.message && (
                <Alert>
                  <AlertDescription>
                    <strong>Preview:</strong> This log will be created with{" "}
                    <SeverityBadge
                      className="mx-1 inline-flex"
                      severity={values.severity}
                    />{" "}
                    severity from source &ldquo;{values.source}&rdquo;.
                  </AlertDescription>
                </Alert>
              )
            }
          </form.Subscribe>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              disabled={createLogMutation.isPending}
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <form.Subscribe>
              {({
                canSubmit,
                isSubmitting,
              }: {
                canSubmit: boolean;
                isSubmitting: boolean;
              }) => (
                <Button
                  className="flex items-center gap-2"
                  disabled={
                    !canSubmit || createLogMutation.isPending || isSubmitting
                  }
                  type="submit"
                >
                  <SaveIcon className="h-4 w-4" />
                  {createLogMutation.isPending || isSubmitting
                    ? "Creating..."
                    : "Create Log"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
