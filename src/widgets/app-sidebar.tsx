import { SquareTerminal } from "lucide-react";
import type * as React from "react";

import { FULFILLED, type STATUSES_TYPES } from "@/redux/constants";
import { useAppSelector } from "@/redux/shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";
import { NavMain } from "@/widgets/nav-main";
import { NavUser } from "@/widgets/nav-user";
import ServicesDropdown from "./ServicesDropdown";

type AppSidebarType = {
	status: STATUSES_TYPES[number];
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ status, ...props }: AppSidebarType) {
	const isMobile = useIsMobile();
	const remotes = useAppSelector((state) => state.host.remotes);
	const currentService = useAppSelector((state) => state.host.currentService);
	const isFulfilled = status === FULFILLED;

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
			{!isFulfilled ? (
				<div className="space-y-4 w-10/12 mt-6 mx-auto">
					<Skeleton className="h-6 bg-[var(--sidebar-skeleton)]" />
					<Skeleton className="h-6 bg-[var(--sidebar-skeleton)]" />
					<Skeleton className="h-6 bg-[var(--sidebar-skeleton)]" />
					<Skeleton className="h-6 bg-[var(--sidebar-skeleton)]" />
				</div>
			) : (
				<>
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
						<SidebarFooter className="pl-4 pb-4">
							<NavUser />
						</SidebarFooter>
					)}
					<SidebarRail />
				</>
			)}
		</Sidebar>
	);
}
