import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react";

import { kc } from "@/entities/keycloak";
import { changeLang, changeUserInfo } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { filterAndSort } from "@/shared/lib/roleUtils";
import { type Langs, langs } from "@/shared/translations/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/ui/sidebar";
import styles from "@/styles/UserDropdown.module.css";
import type { UserType } from "@/types/entities";
import { useTranslation } from "react-i18next";

type UserDropdownType = {
	isFullInfoAvailable: boolean;
};
export function NavUser({ isFullInfoAvailable }: UserDropdownType) {
	const { isMobile } = useSidebar();
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
			<DropdownMenuSubTrigger>
				{t("accounts")} {account}
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
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
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						{/* <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton> */}
						<button
							className={styles["user-select__trigger"]}
							aria-label="User options"
							type="button"
						>
							{userInfo?.given_name} {userInfo?.family_name}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
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

						<DropdownMenuItem
							className={styles["select-item"]}
							onClick={logout}
						>
							{t("logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
