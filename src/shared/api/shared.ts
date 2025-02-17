import {
	type ObjectRecord,
	RequestError,
	getFullUrl,
	getHeaders,
	getInfoForRequest,
	isJSONType,
	request,
} from "@/shared/api";
import {
	type UndefinedInitialDataOptions,
	type UseMutationOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import type { KyResponse } from "ky";

const processUnknownResponse = async <T>(response: KyResponse<T>) => {
	if (response.status === 204) {
		return response;
	}

	if (isJSONType(response.headers.get("Content-Type"))) {
		return await response.json();
	}

	return response;
};

const processJSONnResponse = async <T>(response: KyResponse<T>) => {
	if (isJSONType(response.headers.get("Content-Type"))) {
		return await response.json();
	}
	throw new RequestError("Invalid response type", 0);
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

	return useQuery({
		...queryOptions,
		queryKey,
		queryFn,
		select,
	});
};

type UseCreateData<T, U> = {
	endpoint: string;
	params?: Record<string, string>;
	initialHeaders?: Record<string, string>;
} & Omit<UseMutationOptions<T, Error, U>, "mutationFn" | "onSuccess">;

export const useCreateData = <T, U>({
	endpoint,
	params,
	initialHeaders,
	...mutationOptions
}: UseCreateData<T, U>) => {
	// const queryClient = useQueryClient();
	const appId = getAppId(window.location.pathname);
	const mutationKey = [appId, endpoint, params];

	const mutationFn = (data: U) => {
		const query = params ? `?${new URLSearchParams(params)}` : "";
		return createJsonData<T, U>(`${endpoint}${query}`, data, initialHeaders);
	};

	return useMutation<T, Error, U>({
		...mutationOptions,
		mutationFn,
		mutationKey,
		onSuccess: () => {
			// 	queryClient.invalidateQueries({ queryKey: [endpoint] });
			showSuccessNotification();
		},
	});
};

type UseUpdateData<T, U> = {
	endpoint: string;
	params?: Record<string, string>;
	initialHeaders?: Record<string, string>;
} & Omit<UseMutationOptions<T, Error, U>, "mutationFn" | "onSuccess">;

export const useUpdateData = <T, U>({
	endpoint,
	params,
	initialHeaders,
	...mutationOptions
}: UseUpdateData<T, U>) => {
	const appId = getAppId(window.location.pathname);
	const mutationKey = [appId, endpoint, params];

	const mutationFn = (data: U) => {
		const query = params ? `?${new URLSearchParams(params)}` : "";
		return updateJSONData<T, U>(`${endpoint}${query}`, data, initialHeaders);
	};

	return useMutation<T, Error, U>({
		...mutationOptions,
		mutationFn,
		mutationKey,
		onError: (error) => showErrorNotification(error),
		onSuccess: () => showSuccessNotification(),
	});
};

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
