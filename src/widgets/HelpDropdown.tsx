import { useAppSelector } from "@/redux/store";
import QuestionLogo from "@/shared/images/question.svg";
import styles from "@/styles/HelpDropdown.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const HelpDropdown = () => {
	const helpBaseUrl = `https://help.${process.env.REACT_APP_CP_VENDOR || "icdc"}.io`;
	const lang = useAppSelector((state) => state.host.lang);
	const currentService = useAppSelector((state) => state.host.currentService);
	const helpPath = !currentService
		? ""
		: `/${lang}/${currentService}/Welcome.html`;

	const goToHelp = () => {
		window.open(helpBaseUrl + helpPath);
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					className={styles["help-button"]}
					type="button"
					aria-label="Help options"
				>
					<img src={QuestionLogo} alt="Help icon" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className={styles.help__content} sideOffset={5}>
					<DropdownMenu.Item
						className={styles["help-item"]}
						onSelect={goToHelp}
					>
						Help & Asistance
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default HelpDropdown;
