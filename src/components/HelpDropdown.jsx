import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import QuestionLogo from "../images/question.svg";
import { useSelector } from "react-redux";

const HelpDropdown = () => {
  const helpBaseUrl = `https://help.${
    process.env.REACT_APP_CP_VENDOR || "icdc"
  }.io`;
  const lang = useSelector((state) => state.host.lang);
  const currentService = useSelector((state) => state.host.currentService);
  const helpPath = !currentService
    ? ""
    : `/${lang}/${currentService}/Welcome.html`;

  const goToHelp = () => {
    window.open(helpBaseUrl + helpPath);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="help-button" aria-label="Help options">
          <img src={QuestionLogo} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="help__content" sideOffset={5}>
          <DropdownMenu.Item className="help-item" onSelect={goToHelp}>
            Help & Asistance
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default HelpDropdown;
