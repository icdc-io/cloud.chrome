import { SquareTerminal } from "lucide-react";
import type * as React from "react";

import { useAppSelector } from "@/redux/shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/shared/ui/sidebar";
import { NavMain } from "@/widgets/nav-main";
import ServicesDropdown from "./ServicesDropdown";
import UserDropdown from "./UserDropdown";

type AppSidebarType = React.ComponentProps<typeof Sidebar> & {
	logout: () => Promise<void>;
};

export function AppSidebar({ logout, ...props }: AppSidebarType) {
	const isMobile = useIsMobile();
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
			{isMobile && (
				<SidebarFooter className="p-2">
					<UserDropdown logout={logout} />
				</SidebarFooter>
			)}
			<SidebarRail />
		</Sidebar>
	);
}
