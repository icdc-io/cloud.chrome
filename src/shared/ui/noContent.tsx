import styles from "@/styles/ErrorScreen.module.css";
import { Meh } from "lucide-react";
import { useTranslation } from "react-i18next";

type NoContent = {
	textMessage: string;
};

const NoContent = ({ textMessage }: NoContent) => {
	const { t } = useTranslation();
	return (
		<div className={styles["error-segment"]}>
			<div className={styles["error-header"]}>
				<div className={styles["error-icon"]}>
					<Meh size={54} />
				</div>
				<p>{t(textMessage)}</p>
			</div>
		</div>
	);
};

export default NoContent;
