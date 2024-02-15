import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { changeUserInfo } from "../redux/actions";

const LocationSelector = () => {
  const dispatch = useDispatch();
  const { account, location } = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);
  const currentServiceName = useSelector((state) => state.host.currentService);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);

  const getLocationsAvailability = () => {
    const availableLocations = [],
      notAvailableLocations = [];

    Object.keys(baseUrls).forEach((locationName) => {
      if (
        fullAccountsInfo[account].servicesInLocations[location][
          currentServiceName
        ]
      ) {
        availableLocations.push({
          key: locationName,
          text: locationName,
          value: locationName,
        });
      } else {
        notAvailableLocations.push({
          key: locationName,
          text: locationName,
          value: locationName,
          disabled: true,
        });
      }
    });

    return { availableLocations, notAvailableLocations };
  };

  const { availableLocations, notAvailableLocations } =
    getLocationsAvailability();

  const changeLocation = (newLocation) => {
    dispatch(changeUserInfo(newLocation));
    const localStorageInfo = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem("user", {
      ...localStorageInfo,
      location: newLocation,
    });
  };

  return (
    <label className="location-label">
      Location:
      <Select.Root
        value={location}
        onValueChange={changeLocation}
        className="location-selector"
      >
        <Select.Trigger className="select-trigger" aria-label="Location">
          <Select.Value placeholder={location} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            side="top"
            position="popper"
            className="locations-options"
          >
            <Select.Viewport>
              <Select.Group>
                {availableLocations.map((currentLocation) => (
                  <Select.Item
                    className={"select-item "}
                    value={currentLocation.value}
                    key={currentLocation.value}
                  >
                    <Select.ItemText>{currentLocation.text}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Group>
              <Select.Separator className="SelectSeparator" />
              <Select.Group>
                {notAvailableLocations.map((currentLocation) => (
                  <Select.Item
                    className={"select-item "}
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
