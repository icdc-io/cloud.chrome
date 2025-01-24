import { kc } from "@/entities/keycloak";
import { changeLang, changeUserInfo } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { filterAndSort } from "@/shared/lib/roleUtils";
import { type Langs, langs } from "@/shared/translations/i18n";
import styles from "@/styles/UserDropdown.module.css";
import { useTranslation } from "react-i18next";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { UserType } from "@/types/entities";

type UserDropdownType = {
	isFullInfoAvailable: boolean;
};

const UserDropdown = ({ isFullInfoAvailable }: UserDropdownType) => {
	const dispatch = useAppDispatch();
	const { t, i18n } = useTranslation();
	const userInfo = useAppSelector((state) => state.host.userInfo);
	const { account, role, location } = useAppSelector(
		(state) => state.host.user,
	);
	const locale = useAppSelector((state) => state.host.lang);
	const fullAccountsInfo = useAppSelector(
		(state) => state.host.fullAccountsInfo,
	);

	const logout = () => {
		kc.logout();
	};

	const changeLocale = (newLang: string) => {
		dispatch(changeLang(newLang as Langs));
		i18n.changeLanguage(newLang);
		localStorage.setItem("icdc-lang", newLang);
	};

	const changeCurrentInfo = (name: keyof UserType, value: string) => {
		let newUserInfo: UserType;
		if (name === "role") {
			newUserInfo = {
				account,
				location,
				role: value,
			};
		} else {
			if (!fullAccountsInfo) return;
			const newAccountInfo = fullAccountsInfo[value];

			if (!newAccountInfo) return;

			newUserInfo = {
				account: value,
				location: newAccountInfo.servicesInLocations?.[location]
					? location
					: newAccountInfo.locations[0],
				role: newAccountInfo.roles.includes(role)
					? role
					: filterAndSort(newAccountInfo.roles)[0].value,
			};
		}
		dispatch(changeUserInfo(newUserInfo));
		localStorage.setItem("user", JSON.stringify(newUserInfo));
	};

	const accountsSection = isFullInfoAvailable ? (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className={styles["select-item"]}>
				<div className={styles.RightSlot}>
					<span>{t("accounts")}</span>
					<span className={styles["selected-value"]}>{account}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent className={styles["user-select"]}>
					<DropdownMenuRadioGroup
						value={account}
						onValueChange={(newAccount) =>
							changeCurrentInfo("account", newAccount)
						}
					>
						{Object.values({ ...fullAccountsInfo })
							.map((accountInfo) => ({
								key: accountInfo?.name,
								text: accountInfo?.display_name || "",
								value: accountInfo?.name,
							}))
							.map((currentAccount) => (
								<DropdownMenuRadioItem
									key={currentAccount.key}
									className={styles["select-item"]}
									value={currentAccount.value || ""}
								>
									<div>
										{currentAccount.text}&nbsp;
										<span className={styles.acc_name}>
											({currentAccount.value?.toUpperCase()})
										</span>
									</div>
								</DropdownMenuRadioItem>
							))}
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	) : null;

	const rolesSection = isFullInfoAvailable ? (
		<>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger className={styles["select-item"]}>
					<div className={styles.RightSlot}>
						<span>{t("role")}</span>
						<span className={styles["selected-value"]}>{role}</span>
					</div>
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent className={styles["user-select"]}>
						<DropdownMenuRadioGroup
							value={role}
							onValueChange={(newRole) => changeCurrentInfo("role", newRole)}
						>
							{filterAndSort(fullAccountsInfo?.[account]?.roles).map((role) => (
								<DropdownMenuRadioItem
									key={role.key}
									className={styles["select-item"]}
									value={role.value}
								>
									{role.text}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuPortal>
			</DropdownMenuSub>
			<DropdownMenuSeparator className={styles.DropdownMenuSeparator} />
		</>
	) : null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={styles["user-select__trigger"]}
					aria-label="User options"
					type="button"
				>
					{userInfo?.given_name} {userInfo?.family_name}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent className={styles["user-select"]} sideOffset={5}>
					<DropdownMenuLabel
						className={`${styles["select-item"]} ${styles.label}`}
					>
						{userInfo?.email}
					</DropdownMenuLabel>
					<DropdownMenuSeparator className={styles.DropdownMenuSeparator} />
					{accountsSection}
					{rolesSection}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className={styles["select-item"]}>
							<div className={styles.RightSlot}>
								<span>{t("language")}</span>
								<span className={styles["selected-value"]}>{locale}</span>
							</div>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className={styles["user-select"]}>
								<DropdownMenuRadioGroup
									value={locale}
									onValueChange={changeLocale}
								>
									{langs.map((lang, index) => (
										<DropdownMenuRadioItem
											key={index}
											className={styles["select-item"]}
											value={lang.value}
										>
											{lang.text}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem className={styles["select-item"]} onClick={logout}>
						{t("logout")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};

export default UserDropdown;
