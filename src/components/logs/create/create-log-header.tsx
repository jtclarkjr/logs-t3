"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateLogHeaderProps {
  onBack: () => void;
}

export function CreateLogHeader({ onBack }: CreateLogHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        className="flex items-center gap-2"
        onClick={onBack}
        size="sm"
        variant="ghost"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>
      <div>
        <h1 className="font-bold text-3xl">Create New Log</h1>
        <p className="text-muted-foreground">
          Add a new log entry to the system
        </p>
      </div>
    </div>
  );
}
