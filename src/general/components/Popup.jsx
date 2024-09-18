import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

const AddNatPopup = ({ content, children, ...props }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            {...props}
            className={`TooltipContent ${props.className}`}
          >
            {content}
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default AddNatPopup;
