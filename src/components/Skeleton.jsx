import React from "react";
import PropTypes from "prop-types";

const Skeleton = ({ className }) => (
  <div className={(className || "") + " skeleton"} />
);

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;
