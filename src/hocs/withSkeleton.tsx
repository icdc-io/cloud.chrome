import type React from "react";
import Skeleton from "../components/Skeleton";

type HocType = {
	isStatusFulfilled: boolean;
};

export function withSkeleton<T extends object>(
	Component: React.ComponentType<T>,
): React.FC<T & { isStatusFulfilled: boolean }> {
	const wrapped = ({ isStatusFulfilled, ...props }: HocType) => {
		return isStatusFulfilled ? <Component {...(props as T)} /> : <Skeleton />;
	};
	return wrapped;
}
