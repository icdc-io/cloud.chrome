import { SquareTerminal } from "lucide-react";
import type * as React from "react";
import { useAppSelector } from "@/redux/shared";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/shared/ui/sidebar";
import { NavMain } from "@/widgets/nav-main";
import ServicesDropdown from "./ServicesDropdown";

type AppSidebarType = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarType) {
	const remotes = useAppSelector((state) => state.host.remotes);
	const currentService = useAppSelector((state) => state.host.currentService);

	if (!remotes || !currentService) return;

	const currentRemoteService = remotes.find(
		(serviceInfo) => serviceInfo.path.substring(1) === currentService,
	);
	const currentRemotesList =
		currentRemoteService?.apps?.map((remote) => ({
			title: remote.title,
			url: remote.name,
			icon: SquareTerminal,
		})) || [];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ServicesDropdown />
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					currentService={currentService}
					items={[...currentRemotesList]}
				/>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
