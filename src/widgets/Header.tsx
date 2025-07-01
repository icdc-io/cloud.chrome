import { useAppSelector } from "@/redux/shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "@/styles/Header.module.css";
import HelpDropdown from "@/widgets/HelpDropdown";
import LocationSelector from "@/widgets/LocationSelector";
import UserDropdown from "@/widgets/UserDropdown";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Header = () => {
	const dynamicfilename = process.env.REACT_APP_CP_VENDOR || "icdc";
	const userInfo = useAppSelector((state) => state.host.userInfo);
	const currentService = useAppSelector((state) => state.host.currentService);
	const isMobile = useIsMobile();

	return (
		<header className={styles["chrome-header"]}>
			<div className={styles["left-section"]}>
				{currentService && (
					<SidebarTrigger className="-ml-1 bg-[var(--header-bg)] hover:bg-[var(--header-bg-hv)] whitespace-pre-line" />
				)}

				<Link to="/" className={styles["header-logo"]}>
					<img
						src={require(`@/shared/images/${dynamicfilename}.svg`)}
						alt="Cloud logo"
						className="max-w-fit"
					/>
				</Link>
			</div>

			<div className={styles["info-section"]}>
				{userInfo ? (
					<>
						<NotificationBell />
						<HelpDropdown />
						<LocationSelector />
						{!isMobile && <UserDropdown />}
					</>
				) : (
					<Skeleton className="h-8 bg-[var(--sidebar-skeleton)] w-full" />
				)}
			</div>
		</header>
	);
};

export default Header;
