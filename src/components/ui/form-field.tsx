"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

// Form field wrapper that integrates with forms
interface FormFieldWrapperProps {
  label?: string;
  description?: string;
  required?: boolean;
  errors?: string[];
  children: React.ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  description,
  required,
  errors,
  children,
  className,
}: FormFieldWrapperProps) {
  const hasError = errors && errors.length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div
          className={cn(
            "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive",
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </div>
      )}
      <div>{children}</div>
      {description && !hasError && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {hasError && (
        <div className="text-destructive text-sm">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
