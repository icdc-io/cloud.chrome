import type * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { Skeleton } from "./ui/skeleton";
import { FULFILLED, type STATUSES_TYPES } from "@/redux/constants";
import ServicesDropdown from "./ServicesDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

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
              <NavUser isFullInfoAvailable={status} />
            </SidebarFooter>
          )}
          <SidebarRail />
        </>
      )}
    </Sidebar>
  );
}
