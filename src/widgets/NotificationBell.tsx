import { useAppSelector } from "@/redux/shared";
import type { components } from "@/schemas/notifications-api";
import { getToken } from "@/shared/api";
import {
	// createData,
	// fetchData,
	useFetchData,
	useMutateData,
	// useFetchInfiniteData,
} from "@/shared/api/shared";
import BellSettings from "@/shared/images/bell-settings.svg";
import eventsIcon from "@/shared/images/telemetry_events.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Skeleton } from "@/shared/ui/skeleton";
// import { Skeleton } from "@/shared/ui/skeleton";
import styles from "@/styles/NotificationBell.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EventSource } from "eventsource";
// import * as Tabs from "@radix-ui/react-tabs";
import { Bell, Check, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

const ITEMS_PER_PAGE = 50;

type ReadAllNotificationsBody = {
	ids?: number[];
};

type ReadAllNotificationsResponse = {
	message: string;
	status: number;
	code: string;
	errors: string[];
};

type NotificationsResponse = {
	data: Notification[];
	total: number;
};

const NotificationBell = () => {
	const { t, i18n } = useTranslation();
	// const observer = useRef<IntersectionObserver>();
	const [isAllView, setIsAllView] = useState(false);
	const [isError, setIsError] = useState(false);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const user = useAppSelector((state) => state.host.user);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const {
		// data,
		// error,
		/*fetchNextPage, hasNextPage, */
		isFetching,
		// isLoading,
		refetch,
	} = useFetchData<NotificationsResponse>({
		endpoint: "/api/notification/v1/notifications",
		params: {
			"page[limit]": `${ITEMS_PER_PAGE}`,
		},
		// getNextPageParam: (lastPage, allPages) => {
		// 	return lastPage.data.length === ITEMS_PER_PAGE
		// 		? allPages.length + 1
		// 		: undefined;
		// },
		// initialPageParam: 0,
		enabled: false,
	});
	const [events, setEvents] = useState<Notification[]>([]);
	const { mutateAsync } = useMutateData<
		ReadAllNotificationsResponse,
		ReadAllNotificationsBody
	>({});

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
			setEvents(JSON.parse(event.data).slice(0, ITEMS_PER_PAGE));
		});

		es.addEventListener("notification_update", (event) => {
			const newData = JSON.parse(event.data) as Notification[];

			setEvents((prevState) => {
				const filteredArray = newData.filter(
					(item) => !prevState.find((event) => event.id === item.id),
				);
				return [...filteredArray, ...prevState].slice(0, ITEMS_PER_PAGE);
			});
			if (newData.length) {
				setIsAllView(false);
			}
		});

		es.onerror = (error) => {
			console.log("error ", error);
			setIsError(true);
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

	const refetchNotifications = () =>
		refetch().then((response) => {
			if (!response.data) return;
			setEvents(response.data.data);
		});

	const onReadNotifications = (id?: number) => {
		mutateAsync({
			endpoint: "/api/notification/v1/notifications",
			method: "PATCH",
			body: id ? { ids: [id] } : {},
		})
			// .refetch()
			.then(() => {
				if (id) {
					setEvents((prevState) =>
						prevState.map((notification) =>
							notification.id === id
								? {
										...notification,
										read_at: new Date().toISOString(),
									}
								: notification,
						),
					);
				} else {
					refetchNotifications();
				}
			});
	};

	const onReadNotificationById = (notification?: Notification) => () =>
		notification?.id && !notification.read_at
			? onReadNotifications(notification.id)
			: undefined;

	const onReadAllNotifications = () => onReadNotifications();

	const notificationItems = events.map((notification) => (
		<button
			type="button"
			key={notification.id}
			// ref={lastElementRef}
			// ref={observer}
			className="flex items-center gap-2 mb-4 mt-4 group w-full"
			onClick={onReadNotificationById(notification)}
		>
			<div className="flex items-start gap-2 w-full pr-2">
				{/* <div>
					<div className="w-8 h-8 bg-gray-100 rounded-full mt-1 flex items-center justify-center">
						<Bell size={10} className="text-gray-500" />
					</div>
				</div> */}
				<div className="flex basis-10 justify-center h-5 items-center">
					{!notification.read_at && (
						<span className="h-2.5 w-2.5 bg-[#2185D0] rounded-full" />
					)}
				</div>
				<div className="flex flex-col basis-[400px] break-all	">
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
		</button>
	));

	const goToEvents = () =>
		navigate("/telemetry/notifications", {
			relative: "path",
		});

	const goToNotificationSettings = () =>
		navigate("/telemetry/notification-settings", {
			relative: "path",
		});

	const onOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) return;
		refetchNotifications().then(() => setIsAllView(true));
	};

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger>
				<button
					className="text-white flex items-center justify-center relative"
					type="button"
					aria-label="Notification Bell"
				>
					<Bell size={20} />
					{!isAllView && (
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
						items={
							events.length > 0
								? [
										{
											icon: <Check size={16} />,
											label: t("markAllAsRead"),
											onSelect: onReadAllNotifications,
										},
										{
											icon: (
												<img
													src={eventsIcon}
													alt="Events"
													width={16}
													height={16}
												/>
											),
											label: t("openNotifications"),
											onSelect: goToEvents,
										},
									]
								: [
										{
											icon: (
												<img
													src={BellSettings}
													alt="Notification settings"
													width={16}
													height={16}
												/>
											),
											label: t("openNotificationSettings"),
											onSelect: goToNotificationSettings,
										},
									]
						}
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
					{isError ? (
						<div className="flex justify-center items-center h-screen	max-h-80 text-[#E60000] flex-col gap-2">
							<h3>{t("error")}</h3>
							<p className="text-lg">{t("tryAgainAndRefresh")}</p>
						</div>
					) : isFetching ? (
						new Array(3).fill("").map((_, key) => (
							// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
							<div
								className="flex items-center gap-2 mb-4 mt-4 group w-full"
								key={key}
							>
								<div className="flex basis-10 justify-center h-5 items-center" />
								<div className="flex flex-col basis-[400px] break-all	gap-2">
									<Skeleton className="w-9/12 h-4 rounded-full" />
									<Skeleton className="w-full h-4 rounded-full" />
									<Skeleton className="w-3/12 h-4 rounded-full" />
								</div>
							</div>
						))
					) : events.length !== 0 ? (
						<>{notificationItems}</>
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
