import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  variant?: "table" | "cards" | "chart" | "simple";
  count?: number;
}

export function LoadingState({
  variant = "simple",
  count = 3,
}: LoadingStateProps) {
  if (variant === "table") {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="h-10 w-[50px] whitespace-nowrap px-2 text-left align-middle font-medium text-foreground">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {Array.from({ length: count }, (_, i) => `row-${i}`).map(
                (key) => (
                  <tr
                    className="animate-pulse border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    key={key}
                  >
                    <td className="whitespace-nowrap p-2 align-middle">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="whitespace-nowrap p-2 align-middle">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="whitespace-nowrap p-2 align-middle">
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </td>
                    <td className="whitespace-nowrap p-2 align-middle">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="whitespace-nowrap p-2 align-middle">
                      <Skeleton className="h-8 w-8 rounded" />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => `card-${i}`).map((key) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Simple variant
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => `line-${i}`).map((key) => (
        <Skeleton className="h-4 w-full" key={key} />
      ))}
    </div>
  );
}
