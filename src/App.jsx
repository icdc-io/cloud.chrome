import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";
import { kc, initOptions } from "./keycloak";
import {
  // changeCurrentService,
  fetchAccountsData,
  fetchRemotes,
  fetchRemotesApps,
  fetchServiceVersion,
  // fetchAllData,
} from "./redux/actions";
// import { initGeneralUtils } from "./general/api";
// import { loadComponent } from "./utils";
// import { generalModules } from "./constants/generalModules";

const keycloakRequest = kc.init(initOptions);

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

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
      if (!authSuccess) {
        kc.login();
      } else {
        fetchRemotesApps().then((data) => console.log(data));
        // dispatch(changeCurrentService(window.location.pathname.split("/")[1]));
        dispatch(fetchAccountsData());
        dispatch(fetchServiceVersion());
        dispatch(fetchRemotes());
        // dispatch(fetchAllData());
        // initGeneralUtils();
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
    keycloakRequest.then(initSuccess, initFailed);
  }, [initSuccess]);

  useEffect(() => {
    const messageListener = (e) => {
      e.detail.getUserInfo({
        token: kc.getToken(),
        user: user,
        baseUrl: baseUrls[user.location],
      });
    };
    window.addEventListener("requestInfo", messageListener);

    return () => window.removeEventListener("requestInfo", messageListener);
  }, [user]);

  return <AppRoutes />;
};

export default App;
