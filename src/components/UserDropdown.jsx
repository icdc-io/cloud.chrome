import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { kc } from "../keycloak";
import { langs } from "../i18n";
import { changeLang, changeUserInfo } from "../redux/actions";
import useUserStore from "../currentInfoStore";
import { filterAndSort } from "../utils/roleUtils";
import styles from "../styles/UserDropdown.module.css";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.host.username);
  const email = useSelector((state) => state.host.email);
  const { account, role, location } = useSelector((state) => state.host.user);
  const locale = useSelector((state) => state.host.lang);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);
  const changeUserCurrentInfo = useUserStore(
    (state) => state.changeUserCurrentInfo,
  );

  const logout = () => {
    kc.logout();
  };

  const accountsDropdown = Object.values(fullAccountsInfo).map(
    (accountInfo) => ({
      key: accountInfo.name,
      text: accountInfo.display_name,
      value: accountInfo.name,
    }),
  );

  const roles = fullAccountsInfo[account].roles;

  const changeLocale = (newLang) => {
    dispatch(changeLang(newLang));
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
      kc.updateTokenb();
    } else {
      const newAccountInfo = fullAccountsInfo[value];

      newUserInfo = {
        account: value,
        location: newAccountInfo.servicesInLocations[location]
          ? location
          : newAccountInfo.locations[0],
        role: newAccountInfo.roles.includes(role)
          ? role
          : newAccountInfo.roles[0],
      };
    }
    dispatch(changeUserInfo(newUserInfo));
    localStorage.setItem("user", JSON.stringify(newUserInfo));
    changeUserCurrentInfo(newUserInfo);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={styles["user-select__trigger"]}
          aria-label="User options"
          style={{ color: "white" }}
        >
          {username}
          <ChevronDownIcon color="white" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles["user-select"]} sideOffset={5}>
          <DropdownMenu.Label className={`${styles["select-item"]} ${styles["label"]}`}>
            {email}
          </DropdownMenu.Label>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles["select-item"]}>
              Accounts
              <div className={styles["RightSlot"]}>
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
                  {accountsDropdown.map((currentAccount) => (
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
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles["select-item"]}>
              Role
              <div className="RightSlot">
                <span className={styles["selected-value"]}>{role}</span>
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className={styles["user-select"]}>
                <DropdownMenu.RadioGroup
                  value={role}
                  onValueChange={(newRole) =>
                    changeCurrentInfo("role", newRole)
                  }
                >
                  {filterAndSort(roles).map((role) => (
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
          <DropdownMenu.Separator className={styles["DropdownMenuSeparator"]} />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles["select-item"]}>
              Language
              <div className={styles["RightSlot"]}>
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
            Logout
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className={styles["DropdownMenuArrow"]} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;
