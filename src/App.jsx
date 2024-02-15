import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./AppRoutes";
import { kc, initOptions } from "./keycloak";
import {
  fetchAccountsData,
  fetchRemotes,
  fetchServiceVersion,
} from "./redux/actions";
import "./wrapper.scss";
import { initGeneralUtils } from "./general/api";
// import { loadComponent } from "./utils";
// import { generalModules } from "./constants/generalModules";

const App = () => {
  const dispatch = useDispatch();

  // const loadGeneralModules = (modulesNamesList) => {
  //   modulesNamesList.forEach((moduleName) =>
  //     loadComponent(
  //       "host",
  //       window.location.origin,
  //       `./${moduleName}`,
  //       "general",
  //     ),
  //   );
  // };

  const initSuccess = useCallback(
    (authSuccess) => {
      console.log(authSuccess)
      if (!authSuccess) {
        kc.login();
      } else {
        dispatch(fetchAccountsData());
        dispatch(fetchServiceVersion());
        dispatch(fetchRemotes());
        initGeneralUtils();
        // loadGeneralModules(generalModules);
      }
    },
    [dispatch],
  );

  const initFailed = (e) => {
    console.error("Authenticated Failed " + e);
    kc.logout();
  };

  useEffect(() => {
    kc.init(initOptions).then(initSuccess, initFailed);
  }, [initSuccess]);

  return <AppRoutes />;
};

export default App;
