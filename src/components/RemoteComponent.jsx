import React, { Component } from "react";
import { loadComponent } from "../utils/index";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.hasError && prevState.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

const RemoteComponent = ({
  remote,
  remoteUrl,
  scope = "default",
  remoteFilename = "remoteEntry",
  fallback = null,
  ...props
}) => {
  const Component = React.lazy(
    loadComponent(remote, remoteUrl, `./${remote}`, remoteFilename, scope),
  );

  return (
    <ErrorBoundary>
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

RemoteComponent.propTypes = {
  remote: PropTypes.string,
  remoteUrl: PropTypes.string,
  scope: PropTypes.string,
  remoteFilename: PropTypes.string,
  fallback: PropTypes.node,
};

export default RemoteComponent;
