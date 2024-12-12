import React from "react";
import { Header, Icon, Segment, type SemanticICONS } from "semantic-ui-react";

type NoContent = {
  textMessage: string;
  icon: SemanticICONS;
};

const NoContent = ({ textMessage, icon }: NoContent) => (
  <Segment placeholder>
    <Header icon>
      <Icon
        name={icon === "frown" || icon === "meh" ? `${icon} outline` : icon}
      />
      {textMessage}
    </Header>
  </Segment>
);

export default NoContent;
