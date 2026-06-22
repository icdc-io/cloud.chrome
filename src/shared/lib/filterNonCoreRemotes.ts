import type { ImmutableObject } from "seamless-immutable";
import type { Remote } from "@/types/entities";

export const CORE_NAMESPACE = "core";
export const filterNonCoreRemotes = (r: ImmutableObject<Remote> | Remote) =>
	r.name !== "core";
