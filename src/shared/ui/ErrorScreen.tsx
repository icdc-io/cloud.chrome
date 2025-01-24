import styles from "@/styles/ErrorScreen.module.css";
import { Frown } from "lucide-react";
import { useTranslation } from "react-i18next";

const ErrorScreen = () => {
	const { t } = useTranslation();

	return (
		<>
			<div className={styles["error-segment"]}>
				<div className={styles["error-header"]}>
					<div className={styles["error-icon"]}>
						<Frown size={54} />
					</div>
					<p>{t("wrong")}</p>
				</div>
			</div>
		</>
	);
};

export default ErrorScreen;
