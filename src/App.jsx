import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
const Layout = React.lazy(() => import("./components/Layout"));

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
    // if (!user.location) return;

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

  return <Layout />;
};

export default App;
