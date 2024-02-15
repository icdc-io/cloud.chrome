/* eslint-disable no-console */
import React from "react";
import { Button } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { kc } from "../keycloak";
import styles from "../styles/Error.module.css";

const Error = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.noAccess}>
      <div className={styles["noAccess-wrapper"]}>
        <h2> {t("noAccessAcc")}</h2>
        <div>{t("notMatch")}</div>
        <b>{t("hasAcc")}</b>
        <p>{t("hasAccDescr")}</p>
        <b>{t("hasNotAcc")}</b>
        <p>{t("hasNotAccDescr")}</p>
        <p>{t("thank")}</p>
        <Button
          basic
          size="large"
          color="black"
          style={{ marginTop: "40px" }}
          onClick={() => kc.logout()}
        >
          {t("exitBtn")}
        </Button>
      </div>
    </div>
  );
};

export default Error;
