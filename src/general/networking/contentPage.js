import React from "react";
import { Grid, Loader } from "semantic-ui-react";
import ItemHeader from "./itemHeader";
import NoContent from "./noContent";
import PropTypes from "prop-types";

const ContentPage = ({
  statuses,
  pageData,
  title,
  noContentMessage,
  noContentComponent,
  noContentComponentProps,
  componentDataList,
  componentModal,
  children,
  isTabbedView,
  noContentComponentModal,
  /* Note: isTabbedView is a boolean value that determines if a page will have menu tabs on the top,
    depending on the value the layout of the title header will change */
}) => {
  const checkStatus = () => {
    if (statuses.includes("rejected")) {
      return "error";
    }

    if (statuses.includes("pending") || statuses.includes("")) {
      return "loader";
    }

    if (pageData?.length > 0) {
      return "content";
    }

    return "noContent";
  };

  const content = React.createElement(componentDataList, {
    items: pageData,
  });

  const contentPage = () => {
    /* eslint-disable */
    switch (checkStatus()) {
      case "loader":
        return <Loader active inline="centered" />;
      case "error":
        return <NoContent icon="desktop" textMessage={"Wrong"} />;
      case "content":
        return content;
      default:
        return noContentComponent ? (
          React.createElement(noContentComponent, {
            ...noContentComponentProps,
          })
        ) : (
          <NoContent icon="meh" textMessage={noContentMessage} />
        );
    }
    /* eslint-enable */
  };

  return (
    <>
      {children || (
        <div className="content-page__header">
          <ItemHeader title={title} isTabbedView={isTabbedView} />
          <Grid.Column textAlign="right" width={12}>
            {componentModal && React.createElement(componentModal)}
            {noContentComponentModal &&
              checkStatus() === "noContent" &&
              React.createElement(noContentComponentModal)}
          </Grid.Column>
        </div>
      )}
      {contentPage()}
    </>
  );
};

ContentPage.propTypes = {
  statuses: PropTypes.array,
  pageData: PropTypes.array,
  title: PropTypes.any,
  noContentMessage: PropTypes.any,
  noContentComponent: PropTypes.any,
  componentDataList: PropTypes.any,
  componentModal: PropTypes.any,
  noContentComponentProps: PropTypes.any,
  children: PropTypes.any,
  isTabbedView: PropTypes.bool,
  noContentComponentModal: PropTypes.node,
};

export default ContentPage;
