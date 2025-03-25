import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getAppId } from "../api/shared";

export const useInvalidateQuery = () => {
	const queryClient = useQueryClient();

	const invalidateQuery = useCallback(
		(key?: string[], options?: { exact?: boolean }) => {
			const queryKey = key ?? [getAppId(window.location.pathname)];

			if (!queryKey || queryKey.length === 0) return;

			queryClient.invalidateQueries({
				queryKey,
				exact: options?.exact ?? false,
			});
		},
		[queryClient],
	);

	return invalidateQuery;
};
