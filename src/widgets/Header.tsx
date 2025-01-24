import { changeSidebarVisibility } from "@/redux/actions";
import { FULFILLED, type STATUSES_TYPES } from "@/redux/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { withSkeleton } from "@/shared/hocs/withSkeleton";
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
	const dispatch = useAppDispatch();
	// const isBurgerVisible = useAppSelector((state) => state.host.isBurgerVisible);
	const isSideBarVisible = useAppSelector(
		(state) => state.host.isSideBarVisible,
	);
	const dynamicfilename = process.env.REACT_APP_CP_VENDOR || "icdc";
	const userInfo = useAppSelector((state) => state.host.userInfo);

	// const onClick = () => {
	//   dispatch(changeSidebarVisibility(!isSideBarVisible));
	// };

	const isStatusFulfilled = status === FULFILLED;

	const infoSectionContent = () => (
		<>
			<HelpDropdown />
			{isStatusFulfilled && <LocationSelector />}
			<UserDropdown isFullInfoAvailable={isStatusFulfilled} />
		</>
	);

	const ExtendedInfoSection = withSkeleton(infoSectionContent);

	return (
		<header className={styles["chrome-header"]}>
			{/* {isBurgerVisible && (
        <DrawerTrigger onClick={onClick} asChild>
          <button type="button">
            <img src={Burger} style={{ color: "white" }} alt="Burger menu" />
          </button>
        </DrawerTrigger>
      )} */}
			<SidebarTrigger className="-ml-1 bg-[var(--header-bg)] hover:bg-[var(--header-bg-hv)]" />

			<Link to="/" className={styles["header-logo"]}>
				<img
					src={require(`@/shared/images/${dynamicfilename}.svg`)}
					alt="Cloud logo"
				/>
			</Link>
			<div className={styles["info-section"]}>
				<ExtendedInfoSection isStatusFulfilled={Boolean(userInfo)} />
			</div>
		</header>
	);
};

export default Header;
