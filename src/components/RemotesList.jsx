import React from "react";
import Skeleton from "./Skeleton";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "../styles/RemotesList.css";

const RemotesList = ({ currentRemotesList }) => {
  const currentService = useSelector((state) => state.host.currentService);
  const location = useLocation();
  const currentRemote = location.pathname.split("/")[2];
  console.log(currentRemotesList);

  const remotesRoutesList = currentRemotesList.length ? (
    <nav>
      <ul className="remote-app-routes">
        {currentRemotesList.map((remoteInfo) => (
          <li
            key={remoteInfo.route}
            className={
              (currentRemote === remoteInfo.route ? "active " : "") + "item"
            }
          >
            <Link to={`/${currentService}/${remoteInfo.route}`}>
              {remoteInfo.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  ) : (
    <div className="skeleton-side_wrapper">
      {new Array(4).fill("").map((_, index) => (
        <Skeleton className="aside-skeleton" key={index} />
      ))}
    </div>
  );

  return remotesRoutesList;
};

export default RemotesList;
