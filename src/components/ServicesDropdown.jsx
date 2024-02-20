import React from "react";
import Homepage from "../images/homepage.svg";
import Skeleton from "./Skeleton";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isServiceAvailable } from "../utils/availability";
import { servicesImages } from "../constants/viewConstants";
import styles from "../styles/ServicesDropdown.module.css";

const ServicesDropdown = () => {
  const currentServiceName = useSelector((state) => state.host.currentService);
  const fullAccountsInfo = useSelector((state) => state.host.fullAccountsInfo);
  const user = useSelector((state) => state.host.user);
  const servicesInCurrentLocation = Object.values(
    fullAccountsInfo[user.account].servicesInLocations[user.location],
  );
  const navigate = useNavigate();

  const homepage = {
    text: "Home",
    value: "home",
    image: {
      src: Homepage,
    },
  };

  const mapServicesInLocation = (servicesInfo) => {
    const servicesInfoSet = new Set(servicesInfo);

    const numberOrLast = (position) =>
      typeof position === "number" ? position : 999;

    return [...servicesInfoSet]
      .filter((location) => location && location.displayName && location.name)
      .sort((a, b) => numberOrLast(a.position) - numberOrLast(b.position))
      .filter((service) => isServiceAvailable(service.name, user.account))
      .map((service, key) => {
        const shortNameArray = service.displayName.split("IBACloud ");
        const isExternal = service.url.startsWith("http");
        const isCurrentService = "account" === service.name;

        return {
          key,
          text: service.displayName.startsWith("IBACloud")
            ? shortNameArray[1]
            : shortNameArray[0],
          value: service.path ? service.path.substring(1) : service.name,
          className: isExternal
            ? "external"
            : isCurrentService
              ? "current"
              : "",
          image: {
            src: servicesImages[service.name],
          },
          isExternal: isExternal,
          url: service.path || service.url,
        };
      });
  };

  const handledServices = mapServicesInLocation(servicesInCurrentLocation);

  const onServiceChange = (serviceName) => {
    const highlightedService = handledServices.find(
      (service) => service.value === serviceName,
    );
    if (!highlightedService) {
      navigate("/");
    } else if (highlightedService.isExternal) {
      window.open(highlightedService.url, "_blank");
    } else {
      navigate(highlightedService.url);
    }
  };

  return handledServices.length ? (
    <Select.Root value={currentServiceName} onValueChange={onServiceChange}>
      <Select.Trigger
        className={styles["select-trigger"]}
        aria-label={`Current service - ${currentServiceName}`}
      >
        <Select.Value placeholder={currentServiceName} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={styles["services-select-content"]}
          side="top"
          position="popper"
        >
          <Select.Viewport>
            <Select.Group>
              {handledServices.map((service) => (
                <Select.Item
                  key={service.key}
                  className={`${styles["select-item"]} ${styles[service.className]}`}
                  value={service.value}
                >
                  <img src={service.image.src || ""} />
                  <Select.ItemText>{service.text}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
            <Select.Separator className={styles["separator"]} />
            <Select.Group>
              <Select.Item className={styles["select-item"]}>
                <img src={homepage.image.src} />
                <Select.ItemText>{homepage.text}</Select.ItemText>
              </Select.Item>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  ) : (
    <Skeleton className={styles["services-skeleton"]} width="160px" />
  );
};

export default ServicesDropdown;
