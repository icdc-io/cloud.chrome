import type React from "react";
import { Skeleton } from "@/shared/ui/skeleton";

export const withSkeleton =
	(isLoading: boolean) => (children: React.ReactNode) =>
		isLoading ? <Skeleton className="h-4 w-full" /> : children;
