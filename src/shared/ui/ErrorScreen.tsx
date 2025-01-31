import styles from "@/styles/ErrorScreen.module.css";
import { Frown, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const variants = {
	fetchError: {
		icon: Frown,
		title: "wrong",
		description: "",
	},
	accessError: {
		icon: TriangleAlert,
		title: "accessDeniedTitle",
		description: "accessDeniedDescript",
	},
};

type ErrorScreenProps = {
	type: keyof typeof variants;
};

const ErrorScreen = ({ type = "fetchError" }: ErrorScreenProps) => {
	const { t } = useTranslation();
	const errorContent = variants[type];

	return (
		<>
			<div className={styles["error-segment"]}>
				<div className={styles["error-header"]}>
					<div className={styles["error-icon"]}>
						<errorContent.icon size={54} />
						<h3>{t(errorContent.title)}</h3>
					</div>
					<p>{t(errorContent.description)}</p>
				</div>
			</div>
		</>
	);
};

export default ErrorScreen;
