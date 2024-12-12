import type React from "react";
import { Link } from "react-router-dom";
import Home from "../images/home.svg";
import { FULFILLED, type STATUSES_TYPES } from "../redux/constants";
import styles from "../styles/Layout.module.css";
import RemotesList from "./RemotesList";
import ServicesDropdown from "./ServicesDropdown";
import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
// import { Button } from "./ui/button";
// import { changeSidebarVisibility } from "@/redux/actions";
// import Burger from "../images/burger.svg";

type SidebarType = {
  status: STATUSES_TYPES[number];
  // containerRef: React.MutableRefObject<HTMLElement>;
};

const Sidebar = ({ status }: SidebarType) => {
  const remotes = useAppSelector((state) => state.host.remotes);
  const currentService = useAppSelector((state) => state.host.currentService);
  const user = useAppSelector((state) => state.host.user);
  if (!remotes || !currentService) return;

  const remotesByServices = remotes[user.location] || {};
  const currentRemotesList = remotesByServices[currentService] || [];

  const sidebarHeader =
    status === FULFILLED ? (
      <>
        {currentRemotesList.length ? (
          <Link to={`/${currentService}/${currentRemotesList[0].route}`}>
            <button className={styles["home-button"]} type="button">
              <img src={Home} alt="Home" />
            </button>
          </Link>
        ) : null}
        <div className={styles["vertical-divider"]} />
        <ServicesDropdown />
      </>
    ) : null;

  return (
    <aside className={styles.aside}>
      <div className={styles.sidebar__header}>{sidebarHeader}</div>
      <RemotesList currentRemotesList={currentRemotesList} />
    </aside>
  );
};

export default Sidebar;
