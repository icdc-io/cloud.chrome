import React from "react";
import Skeleton from "../components/Skeleton";
import PropTypes from "prop-types";

// eslint-disable-next-line react/display-name
export const withSkeleton = (Component) => {
  const wrapped = ({ isStatusFulfilled, ...props }) => {
    return isStatusFulfilled ? <Component {...props} /> : <Skeleton />;
  };
  wrapped.protoTypes = {
    isStatusFulfilled: PropTypes.bool,
  };
  return wrapped;
};
