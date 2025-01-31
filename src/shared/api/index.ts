import type { List, User } from "@/types/entities";

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
	"x-icdc-location": user.location,
});

export const request = async (config: RequestParamsType) => {
	if (!navigator.onLine) throw "noInternet";

	let url = config.url;
	if (config.options)
		url += `?${new URLSearchParams(config.options || {}).toString()}`;
	const response = await fetch(url, {
		...config,
		body: config.body ? JSON.stringify(config.body) : undefined,
	});
	if (!response.ok) {
		if (!response.body && !response.statusText) throw response.status;

		if (!response.body) throw response.statusText;

		const contentType = response.headers.get("Content-Type");

		if (!contentType) throw "wrong";

		if (["text/html", "text/plain"].includes(contentType.split(" ")[0])) {
			throw response.statusText;
		}

		const responseError = await response.json();
		throw responseError?.error || responseError;
	}
	if (response.status === 204) return;
	if (
		response.headers.get("Content-Type")?.includes("application/json") &&
		response.body
	) {
		return await response.json().catch((e) => console.log(e));
	}
	return response;
};
