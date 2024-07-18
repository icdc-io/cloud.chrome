import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadServiceTranslationsByServiceName } from "../utils/loadServiceTranslationsByServiceName";
const { Outlet } = require("react-router-dom");

const AvailableRoute = () => {
  const currentServiceName = useSelector((state) => state.host.currentService);

  useEffect(() => {
    loadServiceTranslationsByServiceName(currentServiceName);
  }, [currentServiceName]);

  return <Outlet />;
};

export default AvailableRoute;
