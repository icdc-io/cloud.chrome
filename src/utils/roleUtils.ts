import type { ImmutableArray } from "seamless-immutable";

export const availableRoles = ["admin", "operator", "billing", "member"];

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
