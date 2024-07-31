import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { changeUserInfo } from "../redux/actions";
import styles from "../styles/LocationSelector.module.css";
import { useTranslation } from "react-i18next";

const toDropdownOptions = (options) =>
  options.map((option) => ({
    key: option,
    text: option,
    value: option,
  }));

const LocationSelector = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { account, location } = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);
  const currentServiceName = useSelector((state) => state.host.currentService);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);

  const allLocationsNames = Object.keys(baseUrls);
  const servicesInLocation = fullAccountsInfo[account]?.servicesInLocations;

  if (!servicesInLocation) return null;

  const availableLocations = toDropdownOptions(
    allLocationsNames.filter(
      (locationName) => servicesInLocation[locationName][currentServiceName],
    ),
  );
  const notAvailableLocations = toDropdownOptions(
    allLocationsNames.filter(
      (locationName) => !servicesInLocation[locationName][currentServiceName],
    ),
  );

  const changeLocation = (newLocation) => {
    dispatch(changeUserInfo(newLocation));
    const localStorageInfo = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem("user", {
      ...localStorageInfo,
      location: newLocation,
    });
  };

  return (
    <label className={styles["location-label"]}>
      {t("location")}:
      <Select.Root
        value={location}
        onValueChange={changeLocation}
        className={styles["location-selector"]}
      >
        <Select.Trigger
          className={styles["select-trigger"]}
          aria-label="Location"
        >
          <Select.Value placeholder={location} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            side="top"
            position="popper"
            className={styles["locations-options"]}
          >
            <Select.Viewport>
              <Select.Group>
                {availableLocations.map((currentLocation) => (
                  <Select.Item
                    className={styles["select-item"]}
                    value={currentLocation.value}
                    key={currentLocation.value}
                  >
                    <Select.ItemText>{currentLocation.text}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Group>
              <Select.Separator className={styles["SelectSeparator"]} />
              <Select.Group>
                {notAvailableLocations.map((currentLocation) => (
                  <Select.Item
                    className={styles["select-item"]}
                    value={currentLocation.value}
                    key={currentLocation.value}
                  >
                    <Select.ItemText>{currentLocation.text}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
};

export default LocationSelector;
