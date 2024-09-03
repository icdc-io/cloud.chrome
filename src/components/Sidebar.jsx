import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Home from "../images/home.svg";
import { FULFILLED } from "../redux/constants";
import styles from "../styles/Layout.module.css";
import RemotesList from "./RemotesList";
import ServicesDropdown from "./ServicesDropdown";

const Sidebar = ({ status }) => {
  const remotes = useSelector((state) => state.host.remotes);
  const currentService = useSelector((state) => state.host.currentService);
  const user = useSelector((state) => state.host.user);
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

Sidebar.propTypes = {
  status: PropTypes.string,
};

export default Sidebar;
