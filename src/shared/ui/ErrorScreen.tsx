import styles from "@/styles/ErrorScreen.module.css";
import { Frown, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const variants = {
	0: {
		icon: Frown,
		title: "fetchFailed",
		description: "",
	},
	403: {
		icon: TriangleAlert,
		title: "accessDeniedTitle",
		description: "accessDeniedDescript",
	},
};

type ErrorScreenProps = {
	status?: keyof typeof variants;
};

const ErrorScreen = ({
	status = 0,
	...props
}: ErrorScreenProps & JSX.IntrinsicElements["div"]) => {
	const { t } = useTranslation();
	const errorContent = variants[status];

	return (
		<div {...props}>
			<div className={styles["error-segment"]}>
				<div className={styles["error-header"]}>
					<div className={styles["error-icon"]}>
						<errorContent.icon size={54} />
						<h3>{t(errorContent.title)}</h3>
					</div>
					<p>{t(errorContent.description)}</p>
				</div>
			</div>
		</div>
	);
};

export default ErrorScreen;
