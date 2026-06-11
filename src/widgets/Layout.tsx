import { useEffect, useRef } from "react";
import AppRoutes from "@/app/AppRoutes";
import {
	setRemoteAppInfo,
	setUserInfo,
	updateTokenInfo,
} from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import styles from "@/styles/Layout.module.css";
import type { BaseUrls, Remote, User, UserInfo } from "@/types/entities";
import { AppSidebar } from "@/widgets/app-sidebar";
import Header from "@/widgets/Header";
import ToastNotifications from "@/widgets/ToastNotifications";
import "@/styles/index.css";

const generateKey = (...parts: (string | undefined)[]) =>
	parts.filter(Boolean).join("|");

export type LayoutProps = {
	auth: {
		logout: () => Promise<void>;
		getUserInfo: () => UserInfo;
	};
	remotes: Remote[];
	userInfo: {
		user: User;
		baseUrls: BaseUrls;
		username: string;
		email: string;
	};
	onContextChange: (user: User) => Promise<Remote[]>;
};

const Layout = ({ auth, remotes, userInfo, onContextChange }: LayoutProps) => {
	const dispatch = useAppDispatch();
	const { account, role, location } = useAppSelector((s) => s.host.user);
	const syncedKey = useRef(
		generateKey(
			userInfo?.user?.account,
			userInfo?.user?.role,
			userInfo?.user?.location,
		),
	);

	useEffect(() => {
		dispatch(setUserInfo(userInfo));
		dispatch(updateTokenInfo(auth.getUserInfo()));
		dispatch(setRemoteAppInfo(remotes));
	}, []);

	useEffect(() => {
		if (!account) return;
		const key = generateKey(account, role, location);
		if (key === syncedKey.current) return;

		syncedKey.current = key;
		onContextChange({ account, role, location }).then((freshRemotes) => {
			dispatch(setRemoteAppInfo(freshRemotes));
		});
	}, [account, role, location]);

	return (
		<SidebarProvider>
			<Header logout={auth.logout} />
			<div className="flex min-h-svh">
				<AppSidebar logout={auth.logout} />
				<SidebarInset>
					<div className={styles["main-content"]}>
						<AppRoutes />
					</div>
				</SidebarInset>
			</div>
			<ToastNotifications />
		</SidebarProvider>
	);
};

export default Layout;
