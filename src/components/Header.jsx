import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { withSkeleton } from "../hocs/withSkeleton";
import Burger from "../images/burger.svg";
import { changeSidebarVisibility } from "../redux/actions";
import { FULFILLED } from "../redux/constants";
import styles from "../styles/Header.module.css";
import HelpDropdown from "./HelpDropdown";
import LocationSelector from "./LocationSelector";
import UserDropdown from "./UserDropdown";

const Header = ({ status }) => {
  const dispatch = useDispatch();
  const isBurgerVisible = useSelector((state) => state.host.isBurgerVisible);
  const isSideBarVisible = useSelector((state) => state.host.isSideBarVisible);
  const dynamicfilename = process.env.REACT_APP_CP_VENDOR || "icdc";
  const userInfo = useSelector((state) => state.host.userInfo);

  const onClick = () => {
    dispatch(changeSidebarVisibility(!isSideBarVisible));
  };

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
      {isBurgerVisible && (
        <button onClick={onClick} type="button">
          <img src={Burger} style={{ color: "white" }} alt="Burger menu" />
        </button>
      )}
      <Link to="/" className={styles["header-logo"]}>
        <img
          src={require(`../images/${dynamicfilename}.svg`)}
          alt="Cloud logo"
        />
      </Link>
      <div className={styles["info-section"]}>
        <ExtendedInfoSection isStatusFulfilled={Boolean(userInfo)} />
      </div>
    </header>
  );
};

Header.propTypes = {
  status: PropTypes.string,
};

export default Header;
