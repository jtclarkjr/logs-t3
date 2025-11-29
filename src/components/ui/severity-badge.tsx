import { Badge } from "@/components/ui/badge";
import { SeverityLevel } from "@/lib/enums/severity";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig = {
  [SeverityLevel.DEBUG]: {
    variant: "secondary" as const,
    className:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  },
  [SeverityLevel.INFO]: {
    variant: "secondary" as const,
    className:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800",
  },
  [SeverityLevel.WARNING]: {
    variant: "secondary" as const,
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800",
  },
  [SeverityLevel.ERROR]: {
    variant: "destructive" as const,
    className:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800",
  },
  [SeverityLevel.CRITICAL]: {
    variant: "destructive" as const,
    className:
      "bg-red-200 text-red-900 hover:bg-red-300 dark:bg-red-950 dark:text-red-50 dark:hover:bg-red-900 font-medium",
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <Badge className={cn(config.className, className)} variant={config.variant}>
      {severity}
    </Badge>
  );
}
