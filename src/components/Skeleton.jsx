import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Skeleton.module.css";

const Skeleton = ({ className = "" }) => (
  <div className={`${className} ${styles.skeleton}`} />
);

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;
