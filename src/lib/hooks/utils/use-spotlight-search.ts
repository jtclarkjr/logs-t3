"use client";

import { useEffect, useState } from "react";

interface UseSpotlightSearchOptions {
  onOpen?: () => void;
  enabled?: boolean;
}

export function useSpotlightSearch(options: UseSpotlightSearchOptions = {}) {
  const { onOpen, enabled = true } = options;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        onOpen?.();
      }

      // Forward slash to focus search (like GitHub)
      if (e.key === "/" && !isInputElement(e.target)) {
        e.preventDefault();
        setIsOpen(true);
        onOpen?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onOpen]);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}

function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}
