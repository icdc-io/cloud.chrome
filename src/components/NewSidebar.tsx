import type React from "react";
import { Link } from "react-router-dom";
// import Home from "../images/home.svg";
import { FULFILLED, type STATUSES_TYPES } from "../redux/constants";
// import styles from "../styles/Layout.module.css";
// import RemotesList from "./RemotesList";
// import ServicesDropdown from "./ServicesDropdown";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
// import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
// import { Button } from "./ui/button";
// import { changeSidebarVisibility } from "@/redux/actions";
// import Burger from "../images/burger.svg";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
type SidebarType = {
  status: STATUSES_TYPES[number];
  // containerRef: React.MutableRefObject<HTMLElement>;
};

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const NewSidebar = ({ status }: SidebarType) => {
  const remotes = useAppSelector((state) => state.host.remotes);
  const currentService = useAppSelector((state) => state.host.currentService);
  const user = useAppSelector((state) => state.host.user);
  if (!remotes || !currentService) return;

  const remotesByServices = remotes[user.location] || {};
  const currentRemotesList = remotesByServices[currentService] || [];

  // const sidebarHeader =
  //   status === FULFILLED ? (
  //     <>
  //       {currentRemotesList.length ? (
  //         <Link to={`/${currentService}/${currentRemotesList[0].route}`}>
  //           <button className={styles["home-button"]} type="button">
  //             <img src={Home} alt="Home" />
  //           </button>
  //         </Link>
  //       ) : null}
  //       <div className={styles["vertical-divider"]} />
  //       <ServicesDropdown />
  //     </>
  //   ) : null;

  return status === FULFILLED ? (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ) : null;
};

export default NewSidebar;
