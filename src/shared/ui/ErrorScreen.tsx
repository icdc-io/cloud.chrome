import { useTranslation } from "react-i18next";
import styles from "@/styles/ErrorScreen.module.css";
import { Frown } from "lucide-react";

const ErrorScreen = (props: JSX.IntrinsicElements["div"]) => {
  const { t } = useTranslation();
  return (
    <div {...props}>
      <div className={styles["error-segment"]}>
        <div className={styles["error-header"]}>
          <div className={styles["error-icon"]}>
            <Frown size={54} />
          </div>
          <p>{t("wrong")}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
