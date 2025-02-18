import ky, { HTTPError } from "ky";
import type { List, User } from "../../types/entities";

export type ObjectRecord =
	| {
			[key: string]: string;
	  }
	| undefined;

type UserInfoParams = {
	user: User;
	baseUrl: string;
};

type RequestParamsType<U> = {
	url: string;
	headers: ObjectRecord;
	method?: "PUT" | "POST" | "GET" | "PATCH" | "DELETE";
	body?: U;
	options?: ObjectRecord;
};

export const getInfoForRequest = (): Promise<UserInfoParams> => {
	return new Promise((resolve, reject) => {
		try {
			window.dispatchEvent(
				new CustomEvent("requestInfo", {
					detail: {
						getUserInfo: ({ user, baseUrl }: UserInfoParams) =>
							resolve({ user, baseUrl }),
					},
				}),
			);
		} catch (e) {
			reject({
				user: {},
				baseUrl: "",
			});
		}
	});
};

export const getFullUrl = (initialUrl: string, baseUrl: string) =>
	initialUrl.startsWith("http") ? initialUrl : baseUrl + initialUrl;

function getToken(): Promise<string> {
	return new Promise((resolve) => {
		if (!window.parent) {
			console.log("No parent window available");
			resolve("");
		}

		const requestId = Math.random().toString(36).substr(2, 9);

		const messageHandler = (event: MessageEvent) => {
			if (event.origin !== window.origin) return;
			if (
				event.data?.requestId === requestId &&
				event.data?.action === "sendToken"
			) {
				window.removeEventListener("message", messageHandler);

				if (event.data?.token) {
					resolve(event.data.token);
				} else {
					console.log("No token received");
					resolve("");
				}
			}
		};

		window.addEventListener("message", messageHandler);

		window.parent.postMessage({ requestId, action: "getToken" }, window.origin);
	});
}

export const getHeaders = async (user: User, initialHeaders: List = {}) => {
	const token = await getToken();

	return {
		...initialHeaders,
		Authorization: `Bearer ${token}`,
		"Content-Type": initialHeaders["Content-Type"] || "application/json",
		"x-auth-group": `${user.account}.${user.role}`,
		"x-icdc-account": user.account,
		"x-icdc-role": user.role,
		"x-auth-account": user.account,
		"x-auth-role": user.role,
		"x-icdc-location": user.location,
	};
};

export class RequestError extends Error {
	constructor(
		message: string,
		public status?: number,
	) {
		super(message);
		this.name = "error";
	}
}

const CONTENT_TYPE_JSON = "application/json";

export const isJSONType = (contentType: string | null) =>
	contentType?.includes(CONTENT_TYPE_JSON);

const parseError = (errorData: unknown): string => {
	if (!errorData) return "";
	if (typeof errorData === "string") return errorData;
	if (typeof errorData === "object")
		return [
			...(Array.isArray(errorData)
				? errorData
				: Object.values(errorData)
			).reduce((acc, curr) => {
				const msg = parseError(curr).trim();
				if (msg) acc.add(msg);
				return acc;
			}, new Set()),
		].join("\n");
	return "";
};

export const request = async <T, U = unknown>(config: RequestParamsType<U>) => {
	if (!navigator.onLine) throw new RequestError("noInternet", 0);

	try {
		const response = await ky<T>(config.url, {
			method: config.method ?? "GET",
			headers: config.headers,
			json: config.body,
			searchParams: config.options,
		});

		return response;
	} catch (error) {
		if (error instanceof HTTPError) {
			const { response } = error;
			if (isJSONType(response.headers.get("Content-Type"))) {
				const errorData = await response.json();
				throw new RequestError(parseError(errorData), response.status);
			}
			const errorMessage = response.statusText || "unknown_error";

			throw new RequestError(errorMessage, response.status);
		}

		throw new RequestError("network_error", 0);
	}
};
