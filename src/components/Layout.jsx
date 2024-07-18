import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FULFILLED, PENDING, REJECTED } from "../redux/constants.js";
import { Loader } from "semantic-ui-react";
import { isServiceAvailable } from "../utils/availability";
import Error from "./Error";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }) => {
  const isSideBarVisible = useSelector((state) => state.host.isSideBarVisible);
  const currentService = useSelector((state) => state.host.currentService);
  const user = useSelector((state) => state.host.user);
  const accountsDataFetchStatus = useSelector(
    (state) => state.host.accountsDataFetchStatus,
  );
  const remotesFetchStatus = useSelector(
    (state) => state.host.remotesFetchStatus,
  );
  const serviceVersionFetchStatus = useSelector(
    (state) => state.host.serviceVersionFetchStatus,
  );

  console.log(isSideBarVisible);
  console.log(currentService);
  console.log(user);
  console.log(accountsDataFetchStatus);
  console.log(isServiceAvailable(currentService, user.account));

  const fetchStatuses = [
    accountsDataFetchStatus,
    remotesFetchStatus,
    serviceVersionFetchStatus,
  ];

  const finalFetchStatus = fetchStatuses.includes(REJECTED)
    ? REJECTED
    : fetchStatuses.includes(PENDING)
      ? PENDING
      : FULFILLED;

  const mainContent =
    finalFetchStatus === REJECTED ? (
      <Error />
    ) : finalFetchStatus === PENDING ? (
      <Loader active inline="centered" />
    ) : isServiceAvailable(currentService, user.account) ? (
      children
    ) : (
      <h1>No Access</h1>
    );

  return (
    <>
      <Header status={finalFetchStatus} />
      <div
        className={`${styles[isSideBarVisible ? "" : "without-sidebar"]}  ${styles["below-header"]}`}
      >
        <Sidebar status={finalFetchStatus} />
        <div className={styles["main-content"]}>{mainContent}</div>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
