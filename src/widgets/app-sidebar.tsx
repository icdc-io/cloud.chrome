import type * as React from "react";
import { SquareTerminal } from "lucide-react";

import { NavMain } from "@/widgets/nav-main";
import { NavUser } from "@/widgets/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { Skeleton } from "@/shared/ui/skeleton";
import { FULFILLED, type STATUSES_TYPES } from "@/redux/constants";
import ServicesDropdown from "./ServicesDropdown";
import { useIsMobile } from "@/shared/hooks/use-mobile";

type AppSidebarType = {
  status: STATUSES_TYPES[number];
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ status, ...props }: AppSidebarType) {
  const isMobile = useIsMobile();
  const remotes = useAppSelector((state) => state.host.remotes);
  const currentService = useAppSelector((state) => state.host.currentService);
  const user = useAppSelector((state) => state.host.user);
  const isFulfilled = status === FULFILLED;

  if (!remotes || !currentService) return;

  const remotesByServices = remotes[user.location] || {};
  const currentRemotesList = (remotesByServices[currentService] || []).map(
    (remote) => ({
      title: remote.name,
      url: remote.route,
      icon: SquareTerminal,
    }),
  );

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
            {/* <NavProjects projects={data.projects} /> */}
          </SidebarContent>
          {isMobile && (
            <SidebarFooter>
              <NavUser isFullInfoAvailable={isFulfilled} />
            </SidebarFooter>
          )}
          <SidebarRail />
        </>
      )}
    </Sidebar>
  );
}
