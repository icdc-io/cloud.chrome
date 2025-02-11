import { kc } from "@/entities/keycloak";
import { useAppSelector } from "@/redux/store";
import { homepage } from "@/shared/constants/servicesNames";
import { servicesImages } from "@/shared/constants/viewConstants";
import { isServiceAvailable } from "@/shared/lib/availability";
import styles from "@/styles/ServicesDropdown.module.css";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { components } from "@/shared/schemas/account-api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/ui/sidebar";
import { useTranslation } from "react-i18next";

const ServicesDropdown = () => {
	const { t } = useTranslation();
	const { isMobile } = useSidebar();
	const navigate = useNavigate();

	const currentServiceName = useAppSelector(
		(state) => state.host.currentService,
	);
	const fullAccountsInfo = useAppSelector(
		(state) => state.host.fullAccountsInfo,
	);
	const user = useAppSelector((state) => state.host.user);
	const servicesInCurrentLocation = Object.values(
		fullAccountsInfo?.[user.account]?.servicesInLocations?.[user.location] ||
			{},
	);

	const mapServicesInLocation = (
		servicesInfo: components["schemas"]["Service"][],
	) => {
		const servicesInfoSet = new Set(servicesInfo);

		const numberOrLast = (position: number | string | undefined) =>
			typeof position === "number" ? position : 999;

		return [...servicesInfoSet]
			.filter((location) => location?.displayName && location.name)
			.sort((a, b) => numberOrLast(a.position) - numberOrLast(b.position))
			.filter((service) => isServiceAvailable(service.name, kc.getUserInfo()))
			.map((service, key) => {
				const shortNameArray = service.displayName?.split("IBACloud ") || [
					"",
					"",
				];
				const isExternal = service.url?.startsWith("http");
				const isCurrentService = "account" === service.name;

				return {
					key,
					text: service.displayName?.startsWith("IBACloud")
						? shortNameArray[1]
						: shortNameArray[0],
					value: service.path ? service.path.substring(1) : service.name,
					className: isExternal
						? "external"
						: isCurrentService
							? "current"
							: "",
					image: {
						src: service.name ? servicesImages[service.name] : "",
					},
					isExternal: isExternal,
					url: service.path || service.url,
				};
			});
	};

	const handledServices = mapServicesInLocation(servicesInCurrentLocation);

	const onServiceChange = (serviceName: string | undefined) => {
		const highlightedService = handledServices.find(
			(service) => service.value === serviceName,
		);
		if (!highlightedService) {
			navigate("/");
		} else if (highlightedService.isExternal) {
			window.open(highlightedService.url, "_blank");
		} else {
			navigate(highlightedService?.url || "");
		}
	};

	const currentService = handledServices.find(
		(service) => service.value === currentServiceName,
	) || {
		text: "",
		image: {
			src: "",
		},
	};

	return handledServices.length ? (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="px-3 [&>svg]:size-4 data-[state=open]:bg-[var(--header-bg-hv)] data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center">
								<img
									src={currentService.image.src || ""}
									alt="Service icon"
									className="m-auto"
								/>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold text-white">
									{currentService.text}
								</span>
								{/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
							</div>
							<ChevronsUpDown className="ml-auto text-white" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-black"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						{handledServices.map((service) => (
							<DropdownMenuItem
								key={service.key}
								className={`${styles["select-item"]} ${styles[service.className]} ${currentServiceName === service.value ? styles.active : ""}`}
								onClick={() => onServiceChange(service.value)}
								// value={service.value}
							>
								<img src={service.image.src || ""} alt="Service icon" />
								<span className="hover:text-white text-white text-base">
									{service.text}
								</span>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className={`${styles["select-item"]}`}
							onClick={() => onServiceChange(homepage.value)}
						>
							<img src={homepage.image.src || ""} alt="Service icon" />
							<span className="hover:text-white text-white text-base">
								{t(homepage.text)}
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	) : null;
};

export default ServicesDropdown;
