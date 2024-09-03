import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { langs } from "../i18n";
import { kc } from "../keycloak";
import { changeLang, changeUserInfo } from "../redux/actions";
import styles from "../styles/UserDropdown.module.css";
import { filterAndSort } from "../utils/roleUtils";

const UserDropdown = ({ isFullInfoAvailable }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const userInfo = useSelector((state) => state.host.userInfo);
  const { account, role, location } = useSelector((state) => state.host.user);
  const locale = useSelector((state) => state.host.lang);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);

  const logout = () => {
    kc.logout();
  };

  const changeLocale = (newLang) => {
    dispatch(changeLang(newLang));
    i18n.changeLanguage(newLang);
    localStorage.setItem("icdc-lang", newLang);
  };

  const changeCurrentInfo = (name, value) => {
    let newUserInfo;
    if (name === "role") {
      newUserInfo = {
        account,
        location,
        role: value,
      };
    } else {
      const newAccountInfo = fullAccountsInfo[value];

      newUserInfo = {
        account: value,
        location: newAccountInfo.servicesInLocations[location]
          ? location
          : newAccountInfo.locations[0],
        role: newAccountInfo.roles.includes(role)
          ? role
          : filterAndSort(newAccountInfo.roles)[0],
      };
    }
    dispatch(changeUserInfo(newUserInfo));
    localStorage.setItem("user", JSON.stringify(newUserInfo));
  };

  const accountsSection = isFullInfoAvailable ? (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className={styles["select-item"]}>
        {t("accounts")}
        <div className={styles.RightSlot}>
          <span className={styles["selected-value"]}>{account}</span>
          <ChevronRightIcon />
        </div>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent className={styles["user-select"]}>
          <DropdownMenu.RadioGroup
            value={account}
            onValueChange={(newAccount) =>
              changeCurrentInfo("account", newAccount)
            }
          >
            {Object.values(fullAccountsInfo)
              .map((accountInfo) => ({
                key: accountInfo.name,
                text: accountInfo.display_name,
                value: accountInfo.name,
              }))
              .map((currentAccount) => (
                <DropdownMenu.RadioItem
                  key={currentAccount.key}
                  className={styles["select-item"]}
                  value={currentAccount.value}
                >
                  {currentAccount.text}
                </DropdownMenu.RadioItem>
              ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  ) : null;

  const rolesSection = isFullInfoAvailable ? (
    <>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger className={styles["select-item"]}>
          {t("role")}
          <div className={styles.RightSlot}>
            <span className={styles["selected-value"]}>{role}</span>
            <ChevronRightIcon />
          </div>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent className={styles["user-select"]}>
            <DropdownMenu.RadioGroup
              value={role}
              onValueChange={(newRole) => changeCurrentInfo("role", newRole)}
            >
              {filterAndSort(fullAccountsInfo[account].roles).map((role) => (
                <DropdownMenu.RadioItem
                  key={role.key}
                  className={styles["select-item"]}
                  value={role.value}
                >
                  {role.text}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
      <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />
    </>
  ) : null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={styles["user-select__trigger"]}
          aria-label="User options"
          type="button"
        >
          {userInfo.given_name} {userInfo.family_name}
          <ChevronDownIcon color="white" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles["user-select"]} sideOffset={5}>
          <DropdownMenu.Label
            className={`${styles["select-item"]} ${styles.label}`}
          >
            {userInfo.email}
          </DropdownMenu.Label>
          <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />
          {accountsSection}
          {rolesSection}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles["select-item"]}>
              {t("language")}
              <div className={styles.RightSlot}>
                <span className={styles["selected-value"]}>{locale}</span>
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className={styles["user-select"]}>
                <DropdownMenu.RadioGroup
                  value={locale}
                  onValueChange={changeLocale}
                >
                  {langs.map((lang, index) => (
                    <DropdownMenu.RadioItem
                      key={index}
                      className={styles["select-item"]}
                      value={lang.value}
                    >
                      {lang.text}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Item className={styles["select-item"]} onClick={logout}>
            {t("logout")}
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className={styles.DropdownMenuArrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

UserDropdown.propTypes = {
  isFullInfoAvailable: PropTypes.bool,
};

export default UserDropdown;
