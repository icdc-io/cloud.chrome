import type { ImmutableObject } from "seamless-immutable";

type BaseUrlsType =
	| Record<string, string>
	| ImmutableObject<Record<string, string>>
	| null;

export const returnBaseUrl = (
	baseUrls: BaseUrlsType,
	currentLocation: string,
) => {
	if (!baseUrls) return "";
	return baseUrls[currentLocation]
		? baseUrls[currentLocation].substr(
				baseUrls[currentLocation].indexOf(".") + 1,
			)
		: "";
};
