import React from "react";
import { Header, Segment, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";

const NoContent = ({ textMessage, icon }) => (
  <Segment placeholder>
    <Header icon>
      <Icon
        name={icon === "frown" || icon === "meh" ? icon + " outline" : icon}
      />
      {textMessage}
    </Header>
  </Segment>
);

NoContent.propTypes = {
  textMessage: PropTypes.string,
  icon: PropTypes.string,
};

export default NoContent;
