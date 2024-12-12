import { Breadcrumb, Loader } from "semantic-ui-react";
import { Toaster } from "sonner";
import AppRoutes from "../AppRoutes";
import { Errors } from "../constants/errors";
import { FULFILLED, PENDING, REJECTED } from "@/redux/constants";
import styles from "../styles/Layout.module.css";
import ErrorScreen from "./Error";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/redux/store";
import NewSidebar from "./NewSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
// import { Separator } from "@radix-ui/react-dropdown-menu";
// import {
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "./ui/breadcrumb";

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
      <Loader active inline="centered" />
    ) : (
      <AppRoutes />
    );

  return (
    // <SidebarProvider>
    //   <Header status={finalFetchStatus} />
    //   <div
    //     className={`${styles[isSideBarVisible ? "" : "without-sidebar"]} ${isSideBarVisible ? "sidebar_on" : "sidebar_off"} ${styles["below-header"]}`}
    //   >
    //     <NewSidebar status={finalFetchStatus} />
    //     <div className={styles["main-content"]}>{mainContent}</div>
    //   </div>
    //   <Toaster richColors expand={true} />
    // </SidebarProvider>
    <SidebarProvider>
      {/* <header className="flex h-[--header-height] shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header> */}
      <Header status={finalFetchStatus} />

      <div className="flex h-[calc(100svh-var(--header-height))]">
        <AppSidebar status={finalFetchStatus} />
        <SidebarInset>
          <div className={styles["main-content"]}>{mainContent}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
