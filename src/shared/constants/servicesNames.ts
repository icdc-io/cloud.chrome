import Homepage from "@/shared/images/homepage.svg";
import type { Remote } from "@/types/entities";
import { CORE_NAMESPACE } from "../lib/src/shared/lib/filterNonCoreRemotes";

export const CORE: Remote = {
	apps: [],
	description: "",
	display_name: "",
	label: "",
	name: CORE_NAMESPACE,
	path: "/",
	position: 1,
	title: "",
	url: import.meta.env.PROD ? window.location.origin : "http://localhost:8080",
	version: "",
} as const;

export const homepage = {
	text: "toHome",
	value: "home",
	image: {
		src: Homepage,
	},
};
