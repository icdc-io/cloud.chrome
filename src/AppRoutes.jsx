import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RemoteComponent from "./components/RemoteComponent";
import Layout from "./components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  changeBurgerVisibility,
  // changeCurrentService,
  changeSidebarVisibility,
} from "./redux/actions";
import { Loader } from "semantic-ui-react";
import { store } from "./redux/store";
import AvailableRoute from "./components/AvailableRoute";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);
  const remotes = useSelector((state) => state.host.remotes);
  // const currentService = useSelector((state) => state.host.currentService);
  const uniqueInternalServices = useSelector(
    (state) => state.host.uniqueInternalServices,
  );
  const user = useSelector((state) => state.host.user);
  const location = useLocation();

  useEffect(() => {
    const newService = location.pathname.split("/")[1];
    // if (newService !== currentService)
    //   dispatch(changeCurrentService(newService));
    dispatch(changeSidebarVisibility(Boolean(newService)));
    dispatch(changeBurgerVisibility(Boolean(newService)));
  }, [location.pathname]);

  const uniqueInternalServicesList = Object.entries(
    uniqueInternalServices,
  ).filter(
    (serviceInfo) => remotes[user.location][serviceInfo[0].substring(1)],
  );

  const routes = () => {
    return uniqueInternalServicesList
      .map((serviceInfo) => ({
        name: serviceInfo[0].substring(1),
        isAvailableInLocation: Boolean(
          fullAccountsInfo[user.account].servicesInLocations[user.location][
            serviceInfo[0].substring(1)
          ],
        ),
      }))
      .map((serviceInfo) =>
        serviceInfo.isAvailableInLocation ? (
          <Route
            key={serviceInfo.name}
            path={`${serviceInfo.name}/*`}
            Component={AvailableRoute}
          >
            {remotes[user.location][serviceInfo.name].map(
              (remoteServiceInfo) => (
                <Route
                  key={remoteServiceInfo.name}
                  path={`${remoteServiceInfo.route}/*`}
                  element={
                    <RemoteComponent
                      fallback={<Loader active inline="centered" />}
                      remoteUrl={remoteServiceInfo.url}
                      remote={remoteServiceInfo.route}
                      store={store}
                    />
                  }
                />
              ),
            )}
            <Route
              path="*"
              element={
                <Navigate
                  to={remotes[user.location][serviceInfo.name][0].route}
                  replace
                />
              }
            />
          </Route>
        ) : (
          <Route
            key={serviceInfo.name}
            path={serviceInfo.name}
            element={<h1>Not available in this location</h1>}
          />
        ),
      );
  };

  return (
    <Layout>
      {!uniqueInternalServicesList.length ? (
        <Loader active inline="centered" />
      ) : (
        <Routes>
          <Route index element={<h1>Home</h1>} />
          {routes()}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Layout>
  );
};

export default AppRoutes;
