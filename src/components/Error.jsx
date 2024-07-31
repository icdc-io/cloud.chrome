import React from "react";
import { useTranslation } from "react-i18next";
import { kc } from "../keycloak";
import PropTypes from "prop-types";
import UnauthorizeImg from "../images/401.svg";
import NoAccessImg from "../images/403.svg";
import {
  NO_ACCESS_ERROR,
  UNAVAILABLE_IN_CURRENT_LOCATION_STATUS,
} from "../constants/errors";
import "../styles/Error.scss";

const NoAccessError = () => {
  const { t } = useTranslation();
  const supportLink = `https://${process.env.REACT_APP_CP_VENDOR}.io/#contact`;
  return (
    <div className="content_wrapper noAccess">
      <div className="textBlock">
        <h2>{t("noAccessAcc")}</h2>
        <p>{t("notMatch")}</p>
        <h3>{t("hasAcc")}</h3>
        <p>{t("hasAccDescr")}</p>
        <h3>{t("hasNotAcc")}</h3>
        <p>{t("hasNotAccDescr")}</p>
        <br />
        <p>{t("thank")}</p>
        <div className="actions">
          <button onClick={() => window.open(supportLink)}>
            {t("supportBtn")}
          </button>
          <button color="black" onClick={() => kc.logout()}>
            {t("exitBtn")}
          </button>
        </div>
      </div>
      <img src={NoAccessImg} alt={t("error")} className="imgBlock" />
    </div>
  );
};

const UnauthorizeError = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="content_wrapper unauthorize">
      <div className={`textBlock ${i18n.language}`}>
        <h2>{t("unauthTitle")}</h2>
        <p>{t("unAuthDescription")}</p>
        <button onClick={() => kc.logout()}>{t("logout")}</button>
      </div>
      <img src={UnauthorizeImg} className="imgBlock" />
    </div>
  );
};

const UnavailableInLocationError = () => {
  const { t } = useTranslation();

  return (
    <div className="content_wrapper unavailableError">
      <div className="textBlock">
        <h2>{t("unAvailable")}</h2>
        <p>{t("unavailableDescription")}</p>
        {/* <button onClick={onReload}>{t('refresh']}</button> */}
      </div>
      <img src={t("errorImg")} alt={t("error")} className="imgBlock" />
    </div>
  );
};

const GeneralError = () => {
  const { t } = useTranslation();

  const statusPage = `https://status.${process.env.REACT_APP_CP_VENDOR}.io`;

  const onReload = () => window.location.reload();

  return (
    <div className="content_wrapper generalError">
      <div className="textBlock">
        <h2>{t("wrong")}</h2>
        <p>
          {t("wrongDescription")} <a href={statusPage}>{t("statusPage")}</a>
        </p>
        <button onClick={onReload}>{t("refresh")}</button>
      </div>
      <img src={t("errorImg")} alt={t("error")} className="imgBlock" />
    </div>
  );
};

const Error = ({ errorStatus }) => {
  const mapStatusToErrorComponent = () => {
    if (errorStatus === 401) return <UnauthorizeError />;
    if (errorStatus === NO_ACCESS_ERROR) return <NoAccessError />;
    if (errorStatus === UNAVAILABLE_IN_CURRENT_LOCATION_STATUS)
      return <UnavailableInLocationError />;

    return <GeneralError />;
  };

  return <div className="errorScreen">{mapStatusToErrorComponent()}</div>;
};

Error.propTypes = {
  errorStatus: PropTypes.string,
};

export default Error;
