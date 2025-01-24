import styles from "@/styles/ErrorScreen.module.css";
import { Meh } from "lucide-react";

type NoContent = {
	textMessage: string;
};

const NoContent = ({ textMessage }: NoContent) => (
	<div className={styles["error-segment"]}>
		<div className={styles["error-header"]}>
			<div className={styles["error-icon"]}>
				<Meh size={54} />
			</div>
			<p>{textMessage}</p>
		</div>
	</div>
);

export default NoContent;
