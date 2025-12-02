"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface SpotlightSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpotlightSearch({
  searchQuery,
  onSearchQueryChange,
  open,
  onOpenChange,
}: SpotlightSearchProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with parent searchQuery when it changes externally (e.g., reset filters)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (open) {
      // Focus the input when dialog opens with multiple attempts
      const timers = [
        setTimeout(() => inputRef.current?.focus(), 0),
        setTimeout(() => inputRef.current?.focus(), 50),
        setTimeout(() => inputRef.current?.focus(), 100),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [open]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearchQueryChange(value);
  };

  const handleClear = () => {
    setLocalSearch("");
    onSearchQueryChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="gap-0 p-0 sm:max-w-[600px]"
        onEscapeKeyDown={() => {
          onOpenChange(false);
        }}
        onInteractOutside={() => {
          onOpenChange(false);
        }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search Logs</DialogTitle>
        <DialogDescription className="sr-only">
          Search through your logs using keywords
        </DialogDescription>
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoComplete="off"
            autoFocus
            className="flex h-14 w-full rounded-md border-0 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            id="spotlight-search-input"
            onChange={handleSearch}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder="Search logs..."
            ref={inputRef}
            style={{ pointerEvents: "auto" }}
            type="text"
            value={localSearch}
          />
          {localSearch && (
            <Button
              className="h-8 w-8 shrink-0 p-0 hover:bg-transparent"
              onClick={handleClear}
              size="sm"
              variant="ghost"
            >
              <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <div className="px-4 py-3 text-center text-muted-foreground text-sm">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>{" "}
          to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
