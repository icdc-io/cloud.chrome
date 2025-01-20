import type React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

type HocType = {
  isStatusFulfilled: boolean;
};

export function withSkeleton<T extends object>(
  Component: React.ComponentType<T>,
): React.FC<T & { isStatusFulfilled: boolean }> {
  const wrapped = ({ isStatusFulfilled, ...props }: HocType) => {
    return isStatusFulfilled ? (
      <Component {...(props as T)} />
    ) : (
      <Skeleton className="h-8 bg-[var(--sidebar-skeleton)] w-full" />
    );
  };
  return wrapped;
}
