import {
	type ObjectRecord,
	RequestError,
	getFullUrl,
	getHeaders,
	getInfoForRequest,
	isJSONType,
	request,
} from "@/shared/api";
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

export const createJsonData = async <
	TResponse,
	PRequest = Omit<TResponse, "id">,
>(
	initialUrl: string,
	data: PRequest,
	initialHeaders = {},
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return await processJSONnResponse(
		await request<TResponse>({
			url,
			headers,
			method: "POST",
			body: data,
		}),
	);
};

export const updateJSONData = async <T>(
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
	return await processJSONnResponse(
		await request<T>({
			url,
			headers,
			method: "PUT",
			body: data,
		}),
	);
};

type Error = {
	message: string | undefined;
};

export const showErrorNotification = (
	error: string | Error,
	title: string | undefined,
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
	description: string | undefined,
	title: string | undefined,
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

export const showInfoNotification = (description: string | undefined) => {
	window.dispatchEvent(
		new CustomEvent("showNotification", {
			detail: {
				type: "info",
				title: description,
				description: "",
			},
		}),
	);
};
