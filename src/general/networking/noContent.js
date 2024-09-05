import PropTypes from "prop-types";
import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";

const NoContent = ({ textMessage, icon }) => (
  <Segment placeholder>
    <Header icon>
      <Icon
        name={icon === "frown" || icon === "meh" ? `${icon} outline` : icon}
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
