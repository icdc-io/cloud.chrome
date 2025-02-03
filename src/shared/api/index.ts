import type { List, User } from "@/types/entities";
import ky, { HTTPError, type KyResponse } from "ky";

export type ObjectRecord =
	| {
			[key: string]: string;
	  }
	| undefined;

type UserInfoParams = {
	token: string;
	user: User;
	baseUrl: string;
};

type RequestParamsType = {
	url: string;
	headers: ObjectRecord;
	method?: "PUT" | "POST" | "GET" | "PATCH" | "DELETE";
	body?: unknown;
	options?: ObjectRecord;
};

export const getInfoForRequest = (): Promise<UserInfoParams> => {
	return new Promise((resolve, reject) => {
		try {
			window.dispatchEvent(
				new CustomEvent("requestInfo", {
					detail: {
						getUserInfo: ({ token, user, baseUrl }: UserInfoParams) =>
							resolve({ token, user, baseUrl }),
					},
				}),
			);
		} catch (e) {
			reject({
				token: "",
				user: {},
				baseUrl: "",
			});
		}
	});
};

export const getFullUrl = (initialUrl: string, baseUrl: string) =>
	initialUrl.startsWith("http") ? initialUrl : baseUrl + initialUrl;

export const getHeaders = (
	token: string,
	user: User,
	initialHeaders: List = {},
) => ({
	...initialHeaders,
	Authorization: `Bearer ${token}`,
	"Content-Type": initialHeaders["Content-Type"] || "application/json",
	"x-auth-group": `${user.account}.${user.role}`,
	"x-icdc-account": user.account,
	"x-icdc-role": user.role,
	"x-auth-account": user.account,
	"x-auth-role": user.role,
	"x-icdc-location": user.location,
});

class RequestError extends Error {
	constructor(
		message: string,
		public status?: number,
	) {
		super(message);
		this.name = "error";
	}
}

const CONTENT_TYPE_JSON = "application/json";

const isJSONType = (contentType: string | null) =>
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

export const request = async <T>(config: RequestParamsType) => {
	if (!navigator.onLine) throw new RequestError("noInternet", 0);

	try {
		const response = await ky<T>(config.url, {
			method: config.method ?? "GET",
			headers: config.headers,
			json: config.body,
			searchParams: config.options,
		});

		if (response.status === 204) {
			return response;
		}

		if (isJSONType(response.headers.get("Content-Type"))) {
			return await response.json();
		}

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
