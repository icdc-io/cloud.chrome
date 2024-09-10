import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { NO_ACCESS_ERROR } from "../constants/errors";
import { HOME } from "../constants/servicesNames";
import { kc } from "../keycloak";
import { changeCurrentService, fetchLocationData } from "../redux/actions";
import { isServiceAvailable } from "../utils/availability";
import { loadServiceTranslationsByServiceName } from "../utils/loadServiceTranslationsByServiceName";
import ErrorScreen from "./Error";

const changeMetaData = (serviceInfo) => {
  if (!serviceInfo) {
    document.title = "Home";
  } else {
    document.title = serviceInfo.display_name;
    const description = [...document.getElementsByTagName("META")].find(
      (tag) => tag.name === "description",
    );
    if (description) {
      description.setAttribute("content", serviceInfo.description);
    } else {
      const metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", serviceInfo.description);
    }
  }
};

const AvailableRoute = () => {
  const currentServiceName = useSelector((state) => state.host.currentService);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.host.user);
  const currentService = useSelector((state) => state.host.currentService);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);
  const currentRoute = location.pathname.split("/")[1];
  const currentServiceInfo =
    fullAccountsInfo[user.account].servicesInLocations[user.location][
      currentService
    ];

  useEffect(() => {
    loadServiceTranslationsByServiceName(currentServiceName || HOME);
    changeMetaData(currentServiceInfo);
  }, []);

  useEffect(() => {
    if (currentRoute !== currentServiceName) {
      dispatch(changeCurrentService(currentRoute));
      loadServiceTranslationsByServiceName(currentRoute || HOME);
    }
  }, [currentRoute]);

  useEffect(() => {
    changeMetaData(currentServiceInfo);
  }, [currentService]);

  useEffect(() => {
    dispatch(fetchLocationData(user.location));
  }, [user.location]);

  if (!isServiceAvailable(currentService, user.account, kc.getUserInfo()))
    return <ErrorScreen errorStatus={NO_ACCESS_ERROR} />;

  return <Outlet />;
};

export default AvailableRoute;
