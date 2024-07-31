import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FULFILLED, PENDING, REJECTED } from "../redux/constants.js";
import { Loader } from "semantic-ui-react";
import Error from "./Error";
import styles from "../styles/Layout.module.css";
import AppRoutes from "../AppRoutes";
import {
  CRITICAL_DATA_FETCH_ERROR,
  NO_ACCESS_ERROR,
} from "../constants/errors";

const Layout = () => {
  const isSideBarVisible = useSelector((state) => state.host.isSideBarVisible);
  const accountsDataFetchErrorStatus = useSelector(
    (state) => state.host.accountsDataFetchErrorStatus,
  );
  const accountsDataFetchStatus = useSelector(
    (state) => state.host.accountsDataFetchStatus,
  );
  const remotesFetchStatus = useSelector(
    (state) => state.host.remotesFetchStatus,
  );
  const serviceVersionFetchStatus = useSelector(
    (state) => state.host.serviceVersionFetchStatus,
  );

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
      <Error
        error={
          accountsDataFetchErrorStatus === 403
            ? NO_ACCESS_ERROR
            : CRITICAL_DATA_FETCH_ERROR
        }
      />
    ) : finalFetchStatus === PENDING ? (
      <Loader active inline="centered" />
    ) : (
      <AppRoutes />
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
