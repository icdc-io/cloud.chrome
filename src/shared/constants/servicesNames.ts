import Homepage from "@/shared/images/homepage.svg";
import type { Remote } from "@/types/entities";

export const HOME: Remote = {
	apps: [],
	description: "",
	display_name: "Home",
	label: "",
	name: "home",
	path: "/",
	position: 1,
	title: "Home",
	url: import.meta.env.PROD ? window.location.origin : "http://localhost:8080",
} as const;

export const homepage = {
	text: "toHome",
	value: HOME,
	image: {
		src: Homepage,
	},
};
