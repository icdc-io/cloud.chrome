import PropTypes from "prop-types";
import React from "react";
import { Grid, Header } from "semantic-ui-react";

const ItemHeader = ({ title, traefik, isTabbedView }) => {
  return (
    <Grid.Column
      verticalAlign="middle"
      width={4}
      style={isTabbedView ? { marginTop: 25 } : {}}
    >
      <Header as="h4" style={traefik && { fontSize: "20px" }}>
        {title}
      </Header>
    </Grid.Column>
  );
};

ItemHeader.propTypes = {
  title: PropTypes.any,
  traefik: PropTypes.bool,
  isTabbedView: PropTypes.bool,
};

export default ItemHeader;
