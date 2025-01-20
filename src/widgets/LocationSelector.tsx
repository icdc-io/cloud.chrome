import { useTranslation } from "react-i18next";
import { changeUserInfo } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/shared/ui/select";

const toDropdownOptions = (options: string[]) =>
  options.map((option) => ({
    key: option,
    text: option,
    value: option,
  }));

const LocationSelector = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { account, location, role } = useAppSelector(
    (state) => state.host.user,
  );
  const baseUrls = useAppSelector((state) => state.host.baseUrls);
  const currentServiceName =
    useAppSelector((state) => state.host.currentService) || "";
  const fullAccountsInfo = useAppSelector(
    (state) => state.host.fullAccountsInfo,
  );

  const allLocationsNames = Object.keys(baseUrls || {});
  const servicesInLocation = fullAccountsInfo?.[account]?.servicesInLocations;

  if (!servicesInLocation) return null;

  const availableLocations = toDropdownOptions(
    allLocationsNames.filter((locationName) =>
      currentServiceName === ""
        ? true
        : servicesInLocation?.[locationName]?.[currentServiceName],
    ),
  );
  const notAvailableLocations = toDropdownOptions(
    allLocationsNames.filter((locationName) =>
      currentServiceName === ""
        ? false
        : !servicesInLocation?.[locationName]?.[currentServiceName],
    ),
  );

  const changeLocation = (newLocation: string) => {
    const newUserInfo = { account, role, location: newLocation };
    dispatch(changeUserInfo(newUserInfo));
    localStorage.setItem("user", JSON.stringify(newUserInfo));
  };

  return (
    <div className={"relative flex items-center gap-2"}>
      <span style={{ color: "white" }}>{t("location")}:</span>
      <div>
        <Select defaultValue={location} onValueChange={changeLocation}>
          <SelectTrigger
            className={"py-1 bg-white w-28"}
            aria-label={t("location")}
          >
            <SelectValue>{location}</SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {availableLocations.map((currentLocation) => (
                <SelectItem
                  // className={styles["select-item"]}
                  value={currentLocation.value}
                  key={currentLocation.value}
                >
                  <span>{currentLocation.text}</span>
                </SelectItem>
              ))}
            </SelectGroup>
            {notAvailableLocations.length > 0 && <SelectSeparator />}
            <SelectGroup>
              {notAvailableLocations.map((currentLocation) => (
                <SelectItem
                  // className={styles["select-item"]}
                  value={currentLocation.value}
                  key={currentLocation.value}
                >
                  <span>{currentLocation.text}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
