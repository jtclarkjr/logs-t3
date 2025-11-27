import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center p-12">
        {icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
        <h3 className="mb-2 font-semibold text-lg">{title}</h3>
        {description && (
          <p className="mb-4 max-w-md text-center text-muted-foreground">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
