import { kc } from "../keycloak";

export const adminServicesOnly = ["admin", "billing"];

export const servicesRoles = {
  openshift: ["member"],
  devops: ["member"],
  projects: ["admin", "billing", "manager"],
};

const isAdminRightsValid = () => {
  const token = kc.getUserInfo();
  return token && token.groups.some((group) => /.cloud$/.test(group));
};

const isServiceRightsValid = (availableRolesInService, account) => {
  const token = kc.getUserInfo();
  return (
    token &&
    availableRolesInService.some(
      (role) => token.external.accounts[account].roles.indexOf(role) !== -1,
    )
  );
};

export const isServiceAvailable = (serviceName, account) => {
  if (servicesRoles[serviceName])
    return isServiceRightsValid(servicesRoles[serviceName], account);

  if (!adminServicesOnly.includes(serviceName)) return true;

  return isAdminRightsValid();
};
