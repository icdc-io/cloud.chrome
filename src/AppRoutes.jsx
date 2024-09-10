import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import AvailableRoute from "./components/AvailableRoute";
import RemoteComponent from "./components/RemoteComponent";
import { builtInServices } from "./constants/builtInServices";
import {
  changeBurgerVisibility,
  changeSidebarVisibility,
} from "./redux/actions";
import { store } from "./redux/store";
import "semantic-ui-css/semantic.min.css";
import "./index.css";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);
  const remotes = useSelector((state) => state.host.remotes);
  const uniqueInternalServices = useSelector(
    (state) => state.host.uniqueInternalServices,
  );
  const user = useSelector((state) => state.host.user);
  const location = useLocation();

  useEffect(() => {
    const newService = location.pathname.split("/")[1];
    dispatch(changeSidebarVisibility(Boolean(newService)));
    dispatch(changeBurgerVisibility(Boolean(newService)));
  }, [location.pathname]);

  const uniqueInternalServicesList = Object.entries(
    uniqueInternalServices,
  ).filter((serviceInfo) => {
    return remotes[user.location][serviceInfo[0].substring(1)];
  });

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
      .map((serviceInfo) => {
        return serviceInfo.isAvailableInLocation ? (
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
                      service={serviceInfo.name}
                      store={store}
                    />
                  }
                />
              ),
            )}
            {builtInServices[serviceInfo.name] &&
              builtInServices[serviceInfo.name].map((builtInServiceInfo) => (
                <Route
                  key={builtInServiceInfo.route}
                  path={builtInServiceInfo.route}
                  Component={builtInServiceInfo.Component}
                />
              ))}
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
        );
      });
  };

  return (
    <React.Suspense fallback={<Loader active inline="centered" />}>
      <Routes>
        <Route path="/" Component={AvailableRoute}>
          <Route
            index
            element={
              <RemoteComponent
                fallback={<Loader active inline="centered" />}
                remoteUrl={process.env.REACT_APP_HOME_REMOTE_APP_URL} //change remote Home app url for production
                remote={"home"}
                store={store}
              />
            }
          />
        </Route>
        {routes()}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
