import type { ImmutableArray } from "seamless-immutable";

export const OPERATOR = "operator";
export const OWNER = "owner";
export const ADMIN = "admin";
export const MEMBER = "member";

export const rolesWithAdminRights = [OPERATOR, OWNER, ADMIN];
export const availableRoles = [...rolesWithAdminRights, MEMBER];

const filterAndSort = (list: ImmutableArray<string> | undefined) => {
	if (!list || !list.length) {
		return [];
	}

	return [...list]
		.map((role) => ({
			key: role,
			text: role,
			value: role,
			sortOrder: availableRoles.indexOf(role),
		}))
		.filter((x) => x.sortOrder !== -1)
		.sort((a, b) => a.sortOrder - b.sortOrder);
};

const getAvailableRoles = () => availableRoles;

export { filterAndSort, getAvailableRoles };
