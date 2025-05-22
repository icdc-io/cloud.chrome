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
	type MutableHTTPMethod,
	type ObjectRecord,
	type RequestParamsType,
	getFullUrl,
	getHeaders,
	getInfoForRequest,
	isJSONType,
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
	if (isJSONType(response.headers.get("Content-Type"))) {
		const totalInstancesCount = response.headers.get("X-Total-Count");
		const responseBody = await response.json();

		if (
			response.status === 204 ||
			response.headers.get("Content-Length") === "0"
		) {
			return response as T;
		}
		if (totalInstancesCount) {
			return {
				data: responseBody,
				total: totalInstancesCount,
			} as T;
		}
		return responseBody;
	}

	return response as T;
	// throw new RequestError("Invalid response type", 0);
};

export const fetchData = async <T>(
	initialUrl: string,
	initialHeaders?: ObjectRecord,
	options?: ObjectRecord,
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
	return await processUnknownResponse(
		await request<T>({
			url,
			headers,
			options,
		}),
	);
};

export const updateData = async <T>(
	initialUrl: string,
	data: unknown,
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	initialUrl: string,
	data: unknown,
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	initialUrl: string,
	data: Omit<T, "id">,
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	initialUrl: string,
	params = {},
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
	return (await processUnknownResponse(
		await request({
			url,
			headers,
			method: "DELETE",
			options: params,
		}),
	)) as T;
};

export const fetchJsonData = async <T>(
	initialUrl: string,
	initialHeaders?: ObjectRecord,
	options?: ObjectRecord,
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
	return await processJSONnResponse<T>(
		await request<T>({
			url,
			headers,
			options,
		}),
	);
};

export const fetchNonJSONData = async <T>(
	initialUrl: string,
	initialHeaders?: ObjectRecord,
	options?: ObjectRecord,
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	initialUrl: string,
	data: PRequest,
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	initialUrl: string,
	data: U,
	initialHeaders = {},
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, initialHeaders);
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
	params?: Record<string, string>;
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
	const queryKey = [appId, endpoint, params];

	const queryFn = () => {
		const query = params ? `?${new URLSearchParams(params)}` : "";
		return fetchJsonData<T>(`${endpoint}${query}`, initialHeaders);
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
	}: {
		pageParam: unknown;
	}) => {
		console.log(pageParam);
		const query = new URLSearchParams(params || "");
		query.append("page[offset]", `${pageParam || 1}`);
		const queryString = `?${query.toString()}`;
		console.log(queryString);
		return fetchJsonData<T>(`${endpoint}${queryString}`, initialHeaders);
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
	  }
	| {
			method: "POST" | "PUT" | "PATCH";
			endpoint: string;
			params?: ObjectRecord;
			headers?: ObjectRecord;
			body: U;
	  };

type UseMutateDataOptions<T, U> = Omit<
	UseMutationOptions<T, Error, MutationVariables<U>>,
	"mutationFn"
>;

type MutateJSONData<U> = Omit<RequestParamsType<U>, "method"> & {
	method: MutableHTTPMethod;
};

export const mutateJSONData = async <T, U = unknown>(
	config: MutateJSONData<U>,
) => {
	const { user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		config.url.replace("{account}", user.account),
		baseUrl,
	);
	const headers = await getHeaders(user, config.headers);
	return await processJSONnResponse(
		await request<T, U>({
			...config,
			url,
			headers,
		}),
	);
};

export function useMutateData<T, U = undefined>(
	options: UseMutateDataOptions<T, U>,
): UseMutationResult<T, Error, MutationVariables<U>> {
	const { ...mutationOptions } = options;

	const mutationFn = async (variables: MutationVariables<U>): Promise<T> => {
		const { method, endpoint, params, headers } = variables;

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

		return mutateJSONData<T, undefined>({
			url: endpoint,
			method,
			headers: headers,
			options: params,
		});
	};

	return useMutation<T, Error, MutationVariables<U>>({
		...mutationOptions,
		mutationFn,
		onError: (error, vars, ctx) => {
			showErrorNotification(error);
			return mutationOptions.onError?.(error, vars, ctx);
		},
		onSuccess: (data, vars, ctx) => {
			showSuccessNotification();
			return mutationOptions.onSuccess?.(data, vars, ctx);
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
