import type { ImmutableArray, ImmutableObject } from "seamless-immutable";
import type { UserInfo } from "../../types/entities";
import { OPERATOR } from "./roleUtils";

type ProtectedServices = {
	[key: string]: (a: string[] | ImmutableArray<string>) => boolean;
};

const protectedServices: ProtectedServices = {
	admin: (groups) => groups?.some((group) => /.cloud$/.test(group)),
	billing: (groups) => {
		const re = new RegExp(`\.${OPERATOR}$`);
		return groups?.some((group) => re.test(group));
	},
};

export const isServiceAvailable = (
	serviceName: string | undefined,
	userInfo: ImmutableObject<UserInfo> | UserInfo,
) => {
	if (!serviceName || !userInfo) return false;

	if (!protectedServices[serviceName]) return true;

	return protectedServices[serviceName](userInfo.groups);
};
