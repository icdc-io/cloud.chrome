import React from "react";
import Skeleton from "./Skeleton";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/RemotesList.module.css";
import { builtInServices } from "../constants/builtInServices";

const RemotesList = ({ currentRemotesList }) => {
  const currentService = useSelector((state) => state.host.currentService);
  const location = useLocation();
  const currentRemote = location.pathname.split("/")[2];

  const remotesServicesList = builtInServices[currentService]
    ? [...currentRemotesList, ...builtInServices[currentService]]
    : currentRemotesList;

  const remotesRoutesList = remotesServicesList.length ? (
    <nav>
      <ul className={styles["remote-app-routes"]}>
        {remotesServicesList.map((remoteInfo) => (
          <li
            key={remoteInfo.route}
            className={`
              ${styles[currentRemote === remoteInfo.route ? "active" : ""]}  ${styles.item}`}
          >
            <Link to={`/${currentService}/${remoteInfo.route}`}>
              {remoteInfo.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  ) : (
    <div className={styles["skeleton-side_wrapper"]}>
      {new Array(4).fill("").map((_, index) => (
        <Skeleton className={styles["aside-skeleton"]} key={index} />
      ))}
    </div>
  );

  return remotesRoutesList;
};

export default RemotesList;
