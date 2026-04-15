import { useTranslation } from "react-i18next";
import { kc } from "@/entities/keycloak";
import { Errors } from "@/shared/constants/errors";
import UnauthorizeImg from "@/shared/images/401.svg";
import NoAccessImg from "@/shared/images/403.svg";
import "@/styles/Error.scss";
import type { ErrorStatusType } from "@/shared/constants/errorTypes";

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
					<button type="button" onClick={() => window.open(supportLink)}>
						{t("supportBtn")}
					</button>
					<button type="button" color="black" onClick={() => kc.logout()}>
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
				<button onClick={() => kc.logout()} type="button">
					{t("logout")}
				</button>
			</div>
			<img src={UnauthorizeImg} className="imgBlock" alt="Unauthorized" />
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
				<button onClick={onReload} type="button">
					{t("refresh")}
				</button>
			</div>
			<img src={t("errorImg")} alt={t("error")} className="imgBlock" />
		</div>
	);
};

type ErrorScreenType = {
	errorStatus: ErrorStatusType;
};

const ErrorScreen = ({ errorStatus }: ErrorScreenType) => {
	const mapStatusToErrorComponent = () => {
		if (errorStatus === 401) return <UnauthorizeError />;
		if (errorStatus === Errors.NO_ACCESS_ERROR) return <NoAccessError />;
		if (errorStatus === Errors.UNAVAILABLE_IN_CURRENT_LOCATION_STATUS)
			return <UnavailableInLocationError />;

		return <GeneralError />;
	};

	return <div className="errorScreen">{mapStatusToErrorComponent()}</div>;
};

export default ErrorScreen;
