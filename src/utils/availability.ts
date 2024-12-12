import type { UserInfo } from "@/redux/types";

const adminServicesOnly = ["admin", "billing"];

type ServicesRoles = {
  [key: string]: string[];
};

const servicesRoles: ServicesRoles = {
  openshift: ["member"],
  devops: ["member"],
  projects: ["admin", "billing", "manager"],
};

const isAdminRightsValid = (token: UserInfo) => {
  return token?.groups.some((group) => /.cloud$/.test(group));
};

const isServiceRightsValid = (
  availableRolesInService: string[],
  account: string,
  token: UserInfo,
) => {
  return (
    token &&
    availableRolesInService.some(
      (role) => token.external.accounts[account].roles.indexOf(role) !== -1,
    )
  );
};

export const isServiceAvailable = (
  serviceName: string | undefined,
  account: string,
  token: UserInfo,
) => {
  if (!serviceName) return;

  if (servicesRoles[serviceName])
    return isServiceRightsValid(servicesRoles[serviceName], account, token);

  if (!adminServicesOnly.includes(serviceName)) return true;

  return isAdminRightsValid(token);
};
