import {
	type UndefinedInitialDataInfiniteOptions,
	type UndefinedInitialDataOptions,
	type UseMutationOptions,
	type UseMutationResult,
	useInfiniteQuery,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import type { KyResponse } from "ky";
import {
	isJSONType,
	type MutableHTTPMethod,
	type ObjectRecord,
	type RequestParamsType,
	request,
} from "../../shared/api";

const processUnknownResponse = async <T>(response: KyResponse<T>) => {
	if (response.status === 204) {
		return response;
	}

	if (isJSONType(response.headers.get("Content-Type"))) {
		const totalInstancesCount = response.headers.get("X-Total-Count");
		const responseBody = await response.json();

		if (!totalInstancesCount) return responseBody;

		return {
			total: totalInstancesCount,
			data: responseBody,
		};
	}

	return response;
};

export const processJSONnResponse = async <T>(response: KyResponse<T>) => {
	if (
		response.status === 204 ||
		response.headers.get("Content-Length") === "0"
	) {
		return response as T;
	}
	if (isJSONType(response.headers.get("Content-Type"))) {
		const totalInstancesCount = response.headers.get("X-Total-Count");
		const responseBody = await response.json();

		if (totalInstancesCount) {
			return {
				data: responseBody,
				total: totalInstancesCount,
			} as T;
		}
		return responseBody;
	}

	return response as T;
};

export const fetchData = async <T>(
	url: string,
	headers?: ObjectRecord,
	options?: ObjectRecord,
) => {
	return await processUnknownResponse(
		await request<T>({
			url,
			headers,
			options,
		}),
	);
};

export const updateData = async <T>(
	url: string,
	data: unknown,
	headers?: ObjectRecord,
) => {
	return await processUnknownResponse(
		await request<T>({
			url,
			headers,
			method: "PUT",
			body: data,
		}),
	);
};

export const patchData = async <T>(
	url: string,
	data: unknown,
	headers?: ObjectRecord,
) => {
	return await processUnknownResponse(
		await request<T>({
			url,
			headers,
			method: "PATCH",
			body: data,
		}),
	);
};

export const createData = async <T>(
	url: string,
	data: Omit<T, "id">,
	headers?: ObjectRecord,
) => {
	return await processUnknownResponse(
		await request<T>({
			url,
			headers,
			method: "POST",
			body: data,
		}),
	);
};

export const deleteData = async <T>(
	url: string,
	options?: Record<string, string> | undefined,
	headers?: ObjectRecord,
) => {
	return (await processUnknownResponse(
		await request({
			url,
			headers,
			method: "DELETE",
			options,
		}),
	)) as T;
};

export const fetchJsonData = async <T>(config: RequestParamsType<T>) => {
	return await processJSONnResponse<T>(await request<T>(config));
};

export const fetchNonJSONData = async <T>(
	url: string,
	headers?: ObjectRecord,
	options?: ObjectRecord,
) => {
	return await request<T>({
		url,
		headers,
		options,
	});
};

export const createJsonData = async <
	TResponse,
	PRequest = Omit<TResponse, "id">,
>(
	url: string,
	data: PRequest,
	headers?: ObjectRecord,
) => {
	return await processJSONnResponse(
		await request<TResponse>({
			url,
			headers,
			method: "POST",
			body: data,
		}),
	);
};

export const updateJSONData = async <T, U>(
	url: string,
	data: U,
	headers?: ObjectRecord,
) => {
	return await processJSONnResponse(
		await request<T, U>({
			url,
			headers,
			method: "PUT",
			body: data,
		}),
	);
};

export const getAppId = (pathname: string) => {
	const pathnameParts = pathname.split("/");
	return pathnameParts.slice(0, 3).join("/");
};

type UseFetchData<T, U> = {
	endpoint: string;
	params?: Record<string, string> | string;
	initialHeaders?: Record<string, string>;
} & Omit<UndefinedInitialDataOptions<T, Error, U>, "queryKey" | "queryFn">;

export const useFetchData = <T, U = T>({
	endpoint,
	params,
	initialHeaders,
	select,
	...queryOptions
}: UseFetchData<T, U>) => {
	const appId = getAppId(window.location.pathname);
	const queryKey = [appId, endpoint].filter(Boolean);

	const queryFn = ({ signal }: { signal: AbortSignal }) => {
		return fetchJsonData<T>({
			url: endpoint,
			headers: initialHeaders,
			options: params,
			signal,
		});
	};

	return {
		queryKey,
		...useQuery({
			...queryOptions,
			queryKey,
			queryFn,
			select,
		}),
	};
};

type UseFetchInfiniteData<T, U> = {
	endpoint: string;
	params?: Record<string, string>;
	initialHeaders?: Record<string, string>;
} & Omit<
	UndefinedInitialDataInfiniteOptions<T, Error, U>,
	"queryKey" | "queryFn"
>;

export const useFetchInfiniteData = <T, U = T>({
	endpoint,
	params,
	initialHeaders,
	select,
	...queryOptions
}: UseFetchInfiniteData<T, U>) => {
	const appId = getAppId(window.location.pathname);
	const queryKey = [appId, endpoint];

	const queryFn = ({
		pageParam,
		signal,
	}: {
		pageParam: unknown;
		signal: AbortSignal;
	}) => {
		const query = new URLSearchParams(params || "");
		query.append("page[offset]", `${pageParam || 1}`);
		const queryString = `?${query.toString()}`;
		return fetchJsonData<T>({
			url: `${endpoint}${queryString}`,
			headers: initialHeaders,
			signal,
		});
	};

	return {
		queryKey,
		...useInfiniteQuery({
			...queryOptions,
			queryKey,
			queryFn,
			select,
		}),
	};
};

type MutationVariables<U> =
	| {
			method: "DELETE";
			endpoint: string;
			params?: ObjectRecord;
			headers?: ObjectRecord;
			body?: unknown;
	  }
	| {
			method: "POST" | "PUT" | "PATCH";
			endpoint: string;
			params?: ObjectRecord;
			headers?: ObjectRecord;
			body: U;
	  };

type UseMutateDataOptions<T, U> = {
	notificationDisabled?: boolean;
} & Omit<UseMutationOptions<T, Error, MutationVariables<U>>, "mutationFn">;

type MutateJSONData<U> = Omit<RequestParamsType<U>, "method"> & {
	method: MutableHTTPMethod;
};

export const mutateJSONData = async <T, U = unknown>(
	config: MutateJSONData<U>,
) => {
	return await processJSONnResponse(await request<T, U>(config));
};

export function useMutateData<T, U = undefined>(
	options: UseMutateDataOptions<T, U>,
): UseMutationResult<T, Error, MutationVariables<U>> {
	const { notificationDisabled, ...mutationOptions } = options;

	const mutationFn = async (variables: MutationVariables<U>): Promise<T> => {
		const { method, endpoint, params, headers, body } = variables;

		if (method !== "DELETE") {
			const { body } = variables;
			if (!body) {
				throw new Error(`The 'body' field is required for ${method} requests.`);
			}

			return mutateJSONData<T, U>({
				url: endpoint,
				method,
				headers,
				body,
				options: params,
			});
		}

		return mutateJSONData<T, unknown>({
			url: endpoint,
			method,
			body,
			headers: headers,
			options: params,
		});
	};

	return useMutation<T, Error, MutationVariables<U>>({
		...mutationOptions,
		mutationFn,
		onError: (error, vars, onMutateResult, ctx) => {
			!notificationDisabled && showErrorNotification(error);
			return mutationOptions.onError?.(error, vars, onMutateResult, ctx);
		},
		onSuccess: (data, vars, onMutateResult, ctx) => {
			!notificationDisabled && showSuccessNotification();
			return mutationOptions.onSuccess?.(data, vars, onMutateResult, ctx);
		},
	});
}

type ErrorType = {
	message: string | undefined;
};

export const showErrorNotification = (
	error: string | ErrorType,
	title?: string,
) => {
	const description =
		typeof error === "object" ? error.message : error || "wrong";

	window.dispatchEvent(
		new CustomEvent("showNotification", {
			detail: {
				type: "error",
				title: title,
				description: description,
			},
		}),
	);
};

export const showSuccessNotification = (
	description?: string,
	title?: string,
) => {
	window.dispatchEvent(
		new CustomEvent("showNotification", {
			detail: {
				type: "success",
				title: title,
				description: description,
			},
		}),
	);
};

export const showInfoNotification = (description: string) => {
	window.dispatchEvent(
		new CustomEvent("showNotification", {
			detail: {
				type: "info",
				title: "",
				description: description,
			},
		}),
	);
};
