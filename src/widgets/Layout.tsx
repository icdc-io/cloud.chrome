import AppRoutes from "@/app/AppRoutes";
import { FULFILLED, PENDING, REJECTED } from "@/redux/constants";
import { Errors } from "@/shared/constants/errors";
import Loader from "@/shared/ui/loader";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import styles from "@/styles/Layout.module.css";
import { AppSidebar } from "@/widgets/app-sidebar";
import ErrorScreen from "@/widgets/Error";
import Header from "@/widgets/Header";
import ToastNotifications from "@/widgets/ToastNotifications";
import "@/styles/index.css";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchAppsData, fetchRemotes } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";

const Layout = () => {
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const accountsDataFetchStatus = useAppSelector(
		(state) => state.host.accountsDataFetchStatus,
	);
	const remotesFetchStatus = useAppSelector(
		(state) => state.host.remotesFetchStatus,
	);
	const { account, role, location } = useAppSelector(
		(state) => state.host.user,
	);

	useEffect(() => {
		if (accountsDataFetchStatus !== "fulfilled") return;
		queryClient.clear();
		dispatch(
			import.meta.env.REACT_APP_LOCAL_DATA_USAGE === "full"
				? fetchRemotes()
				: fetchAppsData(),
		);
	}, [account, role, location, accountsDataFetchStatus]);

	const fetchStatuses = [accountsDataFetchStatus, remotesFetchStatus];

	const finalFetchStatus = fetchStatuses.includes(REJECTED)
		? REJECTED
		: fetchStatuses.includes(PENDING)
			? PENDING
			: FULFILLED;

	const mainContent =
		finalFetchStatus === REJECTED ? (
			<ErrorScreen errorStatus={Errors.CRITICAL_DATA_FETCH_ERROR} />
		) : finalFetchStatus === PENDING ? (
			<Loader />
		) : (
			<AppRoutes />
		);

	return (
		<SidebarProvider>
			<Header />
			<div className="flex min-h-svh">
				<AppSidebar status={finalFetchStatus} />
				<SidebarInset>
					<div className={styles["main-content"]}>{mainContent}</div>
				</SidebarInset>
			</div>
			<ToastNotifications />
		</SidebarProvider>
	);
};

export default Layout;
