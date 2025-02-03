import {
	type ObjectRecord,
	getFullUrl,
	getHeaders,
	getInfoForRequest,
	request,
} from "@/shared/api";

export const fetchData = async <T>(
	initialUrl: string,
	initialHeaders?: ObjectRecord,
	options?: ObjectRecord,
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return await request<T>({
		url,
		headers,
		options,
	});
};

export const updateData = async <T>(
	initialUrl: string,
	data: unknown,
	initialHeaders = {},
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return await request<T>({
		url,
		headers,
		method: "PUT",
		body: data,
	});
};

export const patchData = async <T>(
	initialUrl: string,
	data: unknown,
	initialHeaders = {},
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return await request<T>({
		url,
		headers,
		method: "PATCH",
		body: data,
	});
};

export const createData = async <T>(
	initialUrl: string,
	data: Omit<T, "id">,
	initialHeaders = {},
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return await request<T>({
		url,
		headers,
		method: "POST",
		body: data,
	});
};

export const deleteData = async <T>(
	initialUrl: string,
	params = {},
	initialHeaders = {},
) => {
	const { token, user, baseUrl } = await getInfoForRequest();
	const url = getFullUrl(
		initialUrl.replace("{account}", user.account),
		baseUrl,
	);
	const headers = getHeaders(token, user, initialHeaders);
	return (await request({
		url,
		headers,
		method: "DELETE",
		options: params,
	})) as T;
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
