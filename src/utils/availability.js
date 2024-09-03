const adminServicesOnly = ["admin", "billing"];

const servicesRoles = {
  openshift: ["member"],
  devops: ["member"],
  projects: ["admin", "billing", "manager"],
};

const isAdminRightsValid = (token) => {
  return token?.groups.some((group) => /.cloud$/.test(group));
};

const isServiceRightsValid = (availableRolesInService, account, token) => {
  return (
    token &&
    availableRolesInService.some(
      (role) => token.external.accounts[account].roles.indexOf(role) !== -1,
    )
  );
};

export const isServiceAvailable = (serviceName, account, token) => {
  if (servicesRoles[serviceName])
    return isServiceRightsValid(servicesRoles[serviceName], account, token);

  if (!adminServicesOnly.includes(serviceName)) return true;

  return isAdminRightsValid(token);
};
