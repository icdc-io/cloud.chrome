import { Toaster } from "sonner";
import AppRoutes from "@/app/AppRoutes";
import { Errors } from "@/shared/constants/errors";
import { FULFILLED, PENDING, REJECTED } from "@/redux/constants";
import styles from "@/styles/Layout.module.css";
import ErrorScreen from "@/widgets/Error";
import Header from "@/widgets/Header";
import { useAppSelector } from "@/redux/store";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/app-sidebar";
import Loader from "@/shared/ui/loader";
import "@/styles/index.css";

const Layout = () => {
  const isSideBarVisible = useAppSelector(
    (state) => state.host.isSideBarVisible,
  );
  const accountsDataFetchErrorStatus = useAppSelector(
    (state) => state.host.accountsDataFetchErrorStatus,
  );
  const accountsDataFetchStatus = useAppSelector(
    (state) => state.host.accountsDataFetchStatus,
  );
  const remotesFetchStatus = useAppSelector(
    (state) => state.host.remotesFetchStatus,
  );
  const serviceVersionFetchStatus = useAppSelector(
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
      <ErrorScreen
        errorStatus={
          accountsDataFetchErrorStatus === 403
            ? Errors.NO_ACCESS_ERROR
            : Errors.CRITICAL_DATA_FETCH_ERROR
        }
      />
    ) : finalFetchStatus === PENDING ? (
      <Loader />
    ) : (
      <AppRoutes />
    );

  return (
    <SidebarProvider>
      <Header status={finalFetchStatus} />
      <div className="flex h-[calc(100svh-var(--header-height))]">
        <AppSidebar status={finalFetchStatus} />
        <SidebarInset>
          <div className={styles["main-content"]}>{mainContent}</div>
        </SidebarInset>
      </div>
      <Toaster richColors expand={true} />
    </SidebarProvider>
  );
};

export default Layout;
