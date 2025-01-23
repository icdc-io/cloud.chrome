import type { UserInfo } from "@/types/entities";
import { OPERATOR } from "./roleUtils";

type ProtectedServices = {
  [key: string]: (a: string[]) => boolean;
};

const protectedServices: ProtectedServices = {
  admin: (groups: string[]) => groups?.some((group) => /.cloud$/.test(group)),
  billing: (groups: string[]) =>
    groups?.some((group) => /.operator$/.test(group)),
};

export const isServiceAvailable = (
  serviceName: string | undefined,
  userInfo: UserInfo,
) => {
  if (!serviceName || !userInfo) return false;

  if (!protectedServices[serviceName]) return true;

  return protectedServices[serviceName](userInfo.groups);
};
