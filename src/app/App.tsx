import React, { useCallback, useEffect } from "react";
import { initOptions, kc } from "@/entities/keycloak";
import {
  // changeCurrentService,
  fetchAccountsData,
  fetchRemotes,
  fetchRemotesApps,
  fetchServiceVersion,
  // fetchAllData,
} from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { initGeneralUtils } from "./general/api";
// import { loadComponent } from "./utils";
// import { generalModules } from "./constants/generalModules";
const Layout = React.lazy(() => import("@/widgets/Layout"));

const keycloakRequest = kc.init(initOptions);

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.host.user);
  const baseUrls = useAppSelector((state) => state.host.baseUrls);

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
    (authSuccess: boolean) => {
      if (!authSuccess) {
        kc.login();
      } else {
        // dispatch(fetchRemotesApps());
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

  const initFailed = (e: string) => {
    console.error("Authenticated Failed " + e);
    kc.logout();
  };

  useEffect(() => {
    keycloakRequest.then(initSuccess, initFailed);
  }, [initSuccess]);

  useEffect(() => {
    // if (!user.location) return;

    const messageListener = (e: CustomEvent) => {
      e.detail.getUserInfo({
        token: kc.getToken(),
        user: user,
        baseUrl: baseUrls?.[user.location],
      });
    };
    window.addEventListener("requestInfo", messageListener as EventListener);

    return () =>
      window.removeEventListener(
        "requestInfo",
        messageListener as EventListener,
      );
  }, [user]);

  return <Layout />;
};

export default App;
