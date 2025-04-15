import eventsIcon from "@/shared/images/telemetry_events.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import styles from "@/styles/NotificationBell.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";
import { Bell, Check, Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NotificationBell = () => {
	const { t } = useTranslation();

	const tabsOptions = ["all", "events", "alerts"];
	const [selectedTab, setSelectedTab] = useState<string>(tabsOptions[0]);

	const mockNotifications = [
		{
			id: 1,
			title: "Security Update: Token Management",
			description:
				"Secure your integration with the new token management system to safeguard your API keys.",
			read: false,
			date: "Today at 9:42 AM",
		},
		{
			id: 2,
			title: "New Feature: Enhanced Analytics",
			description:
				"Explore the latest analytics tools to optimize your API usage and improve user experience.",
			read: true,
			date: "Yesterday at 11:23 PM",
		},
		{
			id: 3,
			title: "Maintenance Alert: System Upgrade",
			description:
				"Our servers are undergoing scheduled maintenance to ensure optimal performance and reliability.",
			read: false,
			date: "Yesterday at 09:33 AM",
		},
		{
			id: 4,
			title: "New Feature: Enhanced Analytics",
			description:
				"Explore the latest analytics tools to optimize your API usage and improve user experience.",
			read: true,
			date: "Yesterday at 05:23 AM",
		},
	];

	const notificationItems = mockNotifications.map((notification) => (
		<div
			key={notification.id}
			className="flex items-center gap-2 mb-4 mt-4 group"
		>
			<div className="flex items-start gap-2">
				<div>
					<div className="w-8 h-8 bg-gray-100 rounded-full mt-1 flex items-center justify-center">
						<Bell size={10} className="text-gray-500" />
					</div>
				</div>
				<div className="flex flex-col">
					<p className="text-sm font-bold mb-1">{notification.title}</p>
					<p className="text-sm text-gray-600">{notification.description}</p>
					<p className="text-sm text-gray-400 pt-2 font-size-12">
						{notification.date}
					</p>
				</div>
				<div className="flex flex-col items-center gap-2">
					<div
						className={`w-2 h-2 rounded-full mt-1 ${notification.read ? "" : "bg-blue-500"}`}
					/>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button
								type="button"
								aria-label="Notification options"
								className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							>
								<Ellipsis size={12} />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className={styles["notification-bell-content-dropdown"]}
								sideOffset={5}
							>
								<DropdownMenu.Item
									className={styles["notification-bell-content-dropdown-item"]}
									onSelect={() => {}}
								>
									<Check size={16} />
									{t(notification.read ? "markAsUnread" : "markAsRead")}
								</DropdownMenu.Item>
								<DropdownMenu.Item
									className={styles["notification-bell-content-dropdown-item"]}
									onSelect={() => {}}
								>
									<Trash2 size={16} />
									{t("delete")}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>
			</div>
		</div>
	));

	return (
		<Popover>
			<PopoverTrigger>
				<button
					className="text-white flex items-center justify-center"
					type="button"
					aria-label="Notification Bell"
				>
					<Bell size={20} />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[420px]">
				<div className="flex justify-between items-center mb-4">
					<h3>{t("notifications")}</h3>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button
								className={styles["help-button"]}
								type="button"
								aria-label="Help options"
							>
								<Ellipsis />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className={styles["notification-bell-content-dropdown"]}
								sideOffset={5}
							>
								<DropdownMenu.Item
									className={styles["notification-bell-content-dropdown-item"]}
									onSelect={() => {}}
								>
									<Check size={16} />
									{t("markAllAsRead")}
								</DropdownMenu.Item>
								<DropdownMenu.Item
									className={styles["notification-bell-content-dropdown-item"]}
									onSelect={() => {}}
								>
									<img src={eventsIcon} alt="Events" width={16} height={16} />
									{t("openEvents")}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>
				<div>
					<Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
						<Tabs.List className="flex items-center gap-4 bg-gray-100 rounded-lg p-1 w-max">
							{tabsOptions.map((tab) => (
								<Tabs.Trigger
									key={tab}
									value={tab}
									className={`${selectedTab === tab ? "bg-white text-black" : "text-gray-500"} px-4 py-2 rounded-lg`}
								>
									{t(tab)}
								</Tabs.Trigger>
							))}
						</Tabs.List>
						<Tabs.Content
							value={tabsOptions[0]}
							className="max-h-[470px] overflow-y-auto"
						>
							{notificationItems}
						</Tabs.Content>
						<Tabs.Content
							value={tabsOptions[1]}
							className="max-h-[470px] overflow-y-auto"
						>
							{notificationItems}
						</Tabs.Content>
						<Tabs.Content
							value={tabsOptions[2]}
							className="max-h-[470px] overflow-y-auto"
						>
							{notificationItems}
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default NotificationBell;
