import { useAppSelector } from "@/redux/shared";
import type { components } from "@/schemas/notifications-api";
import { getToken } from "@/shared/api";
import {
	// createData,
	// fetchData,
	useFetchData,
	// useFetchInfiniteData,
} from "@/shared/api/shared";
import eventsIcon from "@/shared/images/telemetry_events.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
// import { Skeleton } from "@/shared/ui/skeleton";
import styles from "@/styles/NotificationBell.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EventSource } from "eventsource";
// import * as Tabs from "@radix-ui/react-tabs";
import { Bell, Check, Ellipsis, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Notification = components["schemas"]["Notification"];

const NotificationDropdownMenu = ({
	trigger,
	items,
}: {
	trigger: React.ReactNode;
	items: Array<{ icon: React.ReactNode; label: string; onSelect: () => void }>;
}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				className={styles["notification-bell-content-dropdown"]}
				sideOffset={5}
			>
				{items.map((item, index) => (
					<DropdownMenu.Item
						key={index}
						className={styles["notification-bell-content-dropdown-item"]}
						onSelect={item.onSelect}
					>
						{item.icon}
						{item.label}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

// const ITEMS_PER_PAGE = 10;

const NotificationBell = () => {
	const { t, i18n } = useTranslation();
	// const observer = useRef<IntersectionObserver>();
	const [isAllRead, setIsAllRead] = useState(false);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const user = useAppSelector((state) => state.host.user);
	// const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
	// 	useFetchInfiniteData<Rr>({
	// 		endpoint: "/sse/notification/v1/updates",
	// 		params: {
	// 			"page[limit]": `${ITEMS_PER_PAGE}`,
	// 		},
	// 		getNextPageParam: (lastPage, allPages) => {
	// 			return lastPage.data.length === ITEMS_PER_PAGE
	// 				? allPages.length + 1
	// 				: undefined;
	// 		},
	// 		initialPageParam: 0,
	// 	});
	const [events, setEvents] = useState<Notification[]>([]);
	const readAllRequest = useFetchData({
		endpoint: "/api/notification/v1/notifications/read_all",
		enabled: false,
	});

	const currentLocationUrl = baseUrls?.[user.location];

	useEffect(() => {
		// fetchData("/sse/notification/v1/updates");
		if (!currentLocationUrl) return;
		const es = new EventSource(
			currentLocationUrl + "/sse/notification/v1/updates",
			{
				fetch: async (input, init) => {
					const token = await getToken();

					return fetch(input, {
						...init,
						headers: {
							...init.headers,
							Authorization: `Bearer ${token}`,
							"x-auth-group": `${user.account}.${user.role}`,
							// "x-auth-group": `${user.account}.${user.role}`,
							// "x-icdc-account": user.account,
							// "x-icdc-role": user.role,
							// "x-auth-account": user.account,
							// "x-auth-role": user.role,
							// ...(await getHeaders(user, init.headers)),
						},
					});
				},
			},
		);
		es.addEventListener("notifications", (event) => {
			setEvents(JSON.parse(event.data));
		});

		es.addEventListener("notification_update", (event) => {
			const newData = JSON.parse(event.data) as Notification[];
			setEvents((prevState) => [...newData, ...prevState]);
		});

		es.onerror = (error) => {
			console.log("error ", error);
			es?.close();
		};

		return () => es.close();
	}, [currentLocationUrl, user]);

	// const tabsOptions = ["all", "events", "alerts"];
	// const [selectedTab, setSelectedTab] = useState<string>(tabsOptions[0]);

	// const lastElementRef = useCallback(
	// 	(node: HTMLDivElement) => {
	// 		if (isLoading) return;

	// 		if (observer.current) observer.current.disconnect();

	// 		observer.current = new IntersectionObserver((entries) => {
	// 			if (entries[0].isIntersecting && hasNextPage && !isFetching) {
	// 				fetchNextPage();
	// 			}
	// 		});

	// 		if (node) observer.current.observe(node);
	// 	},
	// 	[fetchNextPage, hasNextPage, isFetching, isLoading],
	// );

	// const data = [];

	// const notifications = useMemo(() => {
	// 	return (data?.pages || []).reduce((acc, page) => {
	// 		return [...acc, ...page.data];
	// 	}, []);
	// }, [data]);

	const notificationItems = events.map((notification) => (
		<div
			key={notification.id}
			// ref={lastElementRef}
			// ref={observer}
			className="flex items-center gap-2 mb-4 mt-4 group"
		>
			<div className="flex items-start gap-2 w-full pr-2">
				{/* <div>
					<div className="w-8 h-8 bg-gray-100 rounded-full mt-1 flex items-center justify-center">
						<Bell size={10} className="text-gray-500" />
					</div>
				</div> */}
				<div className="flex basis-10 justify-center h-5 items-center">
					{!isAllRead && !notification.read_at && (
						<span className="h-2.5 w-2.5 bg-[#2185D0] rounded-full" />
					)}
				</div>
				<div className="flex flex-col grow">
					<p className="text-sm font-bold mb-1">{notification.body}</p>
					<p className="text-sm text-gray-600">{notification.summary}</p>
					<p className="text-sm text-gray-400 pt-2 font-size-12">
						{notification.created_at &&
							new Date(notification.created_at).toLocaleString(i18n.language, {
								dateStyle: "full",
								timeStyle: "medium",
							})}
					</p>
				</div>
				{/* <div className="flex flex-col items-center gap-2">
					<div
						className={`w-2 h-2 rounded-full mt-1 ${notification.status ? "" : "bg-blue-500"}`}
					/> */}
				{/* <NotificationDropdownMenu
						trigger={
							<button
								type="button"
								aria-label="Notification options"
								className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							>
								<Ellipsis size={12} />
							</button>
						}
						items={[
							{
								icon: <Check size={16} />,
								label: t(notification.read ? "markAsUnread" : "markAsRead"),
								onSelect: () => {},
							},
							{
								icon: <Trash2 size={16} />,
								label: t("delete"),
								onSelect: () => {},
							},
						]}
					/> */}
				{/* </div> */}
			</div>
		</div>
	));

	const isNotificationsAvailable =
		events.filter((event) => !event.read_at).length !== 0;

	const onReadAll = () => {
		readAllRequest.refetch().then(() => {
			setIsAllRead(true);
		});
	};

	return (
		<Popover>
			<PopoverTrigger>
				<button
					className="text-white flex items-center justify-center relative"
					type="button"
					aria-label="Notification Bell"
				>
					<Bell size={20} />
					{isNotificationsAvailable && (
						<span className="absolute h-2 w-2 rounded-full bg-[#EF4444] top-0 right-0" />
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className="max-w-[420px] w-[90vw]">
				<div className="flex justify-between items-center mb-4">
					<h3>{t("notifications")}</h3>
					<NotificationDropdownMenu
						trigger={
							<button
								className={styles["help-button"]}
								type="button"
								aria-label="Help options"
							>
								<Ellipsis />
							</button>
						}
						items={[
							{
								icon: <Check size={16} />,
								label: t("markAllAsRead"),
								onSelect: onReadAll,
							},
							{
								icon: (
									<img src={eventsIcon} alt="Events" width={16} height={16} />
								),
								label: t("openEvents"),
								onSelect: () => null,
							},
						]}
					/>
				</div>
				<div className="overflow-auto	max-h-[424px]">
					{/* <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
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
					</Tabs.Root> */}
					{events.length !== 0 ? (
						<>
							{notificationItems}
							{/* <div className="pl-10 flex flex-col gap-2 pr-4">
								{isFetching && (
									<>
										<Skeleton className="w-9/12 h-4 rounded-full" />
										<Skeleton className="w-full h-4 rounded-full" />
										<Skeleton className="w-3/12 h-4 rounded-full" />
									</>
								)}
							</div> */}
						</>
					) : (
						<div className="flex justify-center items-center h-screen	max-h-80 text-[var(--placeholder)] flex-col gap-2">
							<Bell size={63} />
							<p className="text-lg">{t("noNotifications")}</p>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default NotificationBell;
