import { kc } from "@/entities/keycloak";
import { changeLang, changeUserInfo } from "@/redux/actions";
import { filterAndSort } from "@/shared/lib/roleUtils";
import { langs } from "@/shared/translations/i18n";
import type { Langs } from "@/shared/translations/langs";
import styles from "@/styles/UserDropdown.module.css";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/redux/shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useInvalidateQuery } from "@/shared/hooks/useInvalidateQuery";
import { cn } from "@/shared/lib/utils";
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
import { ChevronDownIcon } from "lucide-react";
import { useEffect } from "react";

const UserDropdown = () => {
	const dispatch = useAppDispatch();
	const { t, i18n } = useTranslation();
	const userInfo = useAppSelector((state) => state.host.userInfo);
	const { account, role, location } = useAppSelector(
		(state) => state.host.user,
	);
	const isMobile = useIsMobile();
	const locale = useAppSelector((state) => state.host.lang);
	const invalidateQuery = useInvalidateQuery();

	if (!userInfo || !account) return null;

	const { accounts } = userInfo.external;

	const filteredAccounts = Object.keys(accounts).filter(
		(accountName) =>
			accounts[accountName].locations.length &&
			accounts[accountName].roles.length,
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
		if (name !== "account") {
			newUserInfo = {
				account,
				location,
				role,
				[name]: value,
			};
		} else {
			const newAccountInfo = accounts[value];

			if (!newAccountInfo) return;

			newUserInfo = {
				account: value,
				location: newAccountInfo.locations[0],
				role: newAccountInfo.roles.includes(role)
					? role
					: filterAndSort(newAccountInfo.roles)[0].value,
			};
		}
		dispatch(changeUserInfo(newUserInfo));
		localStorage.setItem("user", JSON.stringify(newUserInfo));
		invalidateQuery();
	};

	const accountsSection = userInfo ? (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className={styles["select-item"]}>
				<div className={styles.RightSlot}>
					<span>{t("account")}</span>
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
						{filteredAccounts
							.map((accountName) => ({
								key: accountName,
								text: accountName,
								value: accountName,
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

	const rolesSection = userInfo ? (
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
							{filterAndSort(accounts[account].roles).map((role) => (
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
					className={cn(
						styles["user-select__trigger"],
						isMobile && "px-4 py-3 hover:bg-[var(--header-bg-hv)] rounded-md",
					)}
					aria-label="User options"
					type="button"
				>
					{userInfo?.given_name} {userInfo?.family_name}
					<ChevronDownIcon color="white" size={15} />
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
