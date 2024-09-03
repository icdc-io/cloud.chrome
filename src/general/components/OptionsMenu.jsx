import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PropTypes from "prop-types";
import React from "react";
import menuItemsTypes from "../constants/menuItemsTypes";
// import { ReactComponent as Dots } from "../../images/dots.svg";
import styles from "../styles/OptionsMenu.module.css";

const OptionsMenu = ({ children, options }) => {
  const optionsMapper = {
    [menuItemsTypes.SUBMENU]: (itemInfo, key) => (
      <DropdownMenu.Sub key={key}>
        <DropdownMenu.SubTrigger
          className={`${styles["menu-item"]} ${itemInfo.className || ""}`}
        >
          {itemInfo.text}
          {itemInfo.icon && (
            <span className={styles["right-slot"]}>
              <itemInfo.icon />
            </span>
          )}
        </DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent
            className={styles["menu__sub-content"]}
            sideOffset={2}
            alignOffset={-5}
            sticky="always"
          >
            {itemInfo.children.map((subItemInfo, index) =>
              optionsMapper[subItemInfo.type](subItemInfo, index),
            )}
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
    ),
    [menuItemsTypes.ITEM]: (itemInfo, key) => (
      <DropdownMenu.Item
        key={key}
        className={`${styles["menu-item"]} ${itemInfo.className || ""}`}
        onClick={itemInfo.action()}
      >
        {itemInfo.text}
        {itemInfo.icon && (
          <span className={styles["right-slot"]}>
            <itemInfo.icon />
          </span>
        )}
      </DropdownMenu.Item>
    ),
    [menuItemsTypes.SEPARATOR]: (_, key) => (
      <DropdownMenu.Separator key={key} className="DropdownMenu.Separator" />
    ),
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {children || (
          <button
            className={styles["menu-button"]}
            type="button"
            aria-label="Menu options"
          >
            xxx
          </button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles["menu-content"]} sideOffset={5}>
          {options.map(
            (option, key) => optionsMapper[option.type](option, key) || null,
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

OptionsMenu.propTypes = {
  children: PropTypes.node,
  options: PropTypes.array,
};

export default OptionsMenu;
