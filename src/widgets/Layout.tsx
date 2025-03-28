import AppRoutes from "@/app/AppRoutes";
import { FULFILLED, PENDING, REJECTED } from "@/redux/constants";
import { Errors } from "@/shared/constants/errors";
import Loader from "@/shared/ui/loader";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import styles from "@/styles/Layout.module.css";
import ErrorScreen from "@/widgets/Error";
import Header from "@/widgets/Header";
import ToastNotifications from "@/widgets/ToastNotifications";
import { AppSidebar } from "@/widgets/app-sidebar";
import "@/styles/index.css";
import { useAppSelector } from "@/redux/shared";

const Layout = () => {
	const accountsDataFetchErrorStatus = useAppSelector(
		(state) => state.host.accountsDataFetchErrorStatus,
	);
	const accountsDataFetchStatus = useAppSelector(
		(state) => state.host.accountsDataFetchStatus,
	);
	const remotesFetchStatus = useAppSelector(
		(state) => state.host.remotesFetchStatus,
	);
	// const serviceVersionFetchStatus = useAppSelector(
	// 	(state) => state.host.serviceVersionFetchStatus,
	// );

	const fetchStatuses = [
		accountsDataFetchStatus,
		remotesFetchStatus,
		// serviceVersionFetchStatus,
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
