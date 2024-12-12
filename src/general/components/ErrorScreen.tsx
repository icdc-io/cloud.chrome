import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, Segment } from "semantic-ui-react";

const ErrorScreen = () => {
  const { t } = useTranslation();

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="frown outline" />
        {t("wrong")}
      </Header>
    </Segment>
  );
};

export default ErrorScreen;
