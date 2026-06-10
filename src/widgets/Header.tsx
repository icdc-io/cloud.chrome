import { Link } from "react-router-dom";
import { useAppSelector } from "@/redux/shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import styles from "@/styles/Header.module.css";
import HelpDropdown from "@/widgets/HelpDropdown";
import LocationSelector from "@/widgets/LocationSelector";
import UserDropdown from "@/widgets/UserDropdown";
import NotificationBell from "./NotificationBell";

const logos = require.context("@/shared/images", false, /\.svg$/);

const Header = ({ logout }: { logout: () => Promise<void> }) => {
	const dynamicfilename = import.meta.env.REACT_APP_CP_VENDOR || "icdc";
	const logoSrc = logos(`./${dynamicfilename}.svg`);
	const currentService = useAppSelector((state) => state.host.currentService);
	const isMobile = useIsMobile();

	return (
		<header className={styles["chrome-header"]}>
			<div className={styles["left-section"]}>
				{currentService && (
					<SidebarTrigger className="-ml-1 bg-[var(--header-bg)] hover:bg-[var(--header-bg-hv)] whitespace-pre-line" />
				)}

				<Link to="/" className={styles["header-logo"]}>
					<img src={logoSrc} alt="Cloud logo" className="max-w-fit" />
				</Link>
			</div>

			<div className={styles["info-section"]}>
				<NotificationBell />
				<HelpDropdown />
				<LocationSelector />
				{!isMobile && <UserDropdown logout={logout} />}
			</div>
		</header>
	);
};

export default Header;
