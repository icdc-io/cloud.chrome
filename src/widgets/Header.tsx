import { changeSidebarVisibility } from "@/redux/actions";
import { FULFILLED, type STATUSES_TYPES } from "@/redux/constants";
import { useAppSelector } from "@/redux/shared";
import { withSkeleton } from "@/shared/hocs/withSkeleton";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import styles from "@/styles/Header.module.css";
import HelpDropdown from "@/widgets/HelpDropdown";
import LocationSelector from "@/widgets/LocationSelector";
import UserDropdown from "@/widgets/UserDropdown";
import { Link } from "react-router-dom";
// import { DrawerTrigger } from "./ui/drawer";

type HeaderType = {
	status: STATUSES_TYPES[number];
};

const Header = ({ status }: HeaderType) => {
	const dynamicfilename = process.env.REACT_APP_CP_VENDOR || "icdc";
	const userInfo = useAppSelector((state) => state.host.userInfo);
	const currentService = useAppSelector((state) => state.host.currentService);
	const isMobile = useIsMobile();

	const isStatusFulfilled = status === FULFILLED;

	const infoSectionContent = () => (
		<>
			<HelpDropdown />
			{isStatusFulfilled && <LocationSelector />}
			{!isMobile && <UserDropdown isFullInfoAvailable={isStatusFulfilled} />}
		</>
	);

	const ExtendedInfoSection = withSkeleton(infoSectionContent);

	return (
		<header className={styles["chrome-header"]}>
			<div className={styles["left-section"]}>
				{currentService && (
					<SidebarTrigger className="-ml-1 bg-[var(--header-bg)] hover:bg-[var(--header-bg-hv)]" />
				)}

				<Link to="/" className={styles["header-logo"]}>
					<img
						src={require(`@/shared/images/${dynamicfilename}.svg`)}
						alt="Cloud logo"
					/>
				</Link>
			</div>

			<div className={styles["info-section"]}>
				<ExtendedInfoSection isStatusFulfilled={Boolean(userInfo)} />
			</div>
		</header>
	);
};

export default Header;
