import CodeSnippet from "@/shared/ui/ApiDialog/CodeSnippet";
import CodeSnippetOptions from "@/shared/ui/ApiDialog/CodeSnippetOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "@/styles/apiButton.scss";
import { useAppSelector } from "@/redux/shared";

type PositionType = "left" | "right" | "center";

type ApiButtonView = {
	actionsData: Record<string, string>;
};

function getTokenFromHost(): Promise<string> {
	return new Promise((resolve) => {
		if (!window.parent) {
			console.log("No parent window available");
			resolve("");
		}

		const requestId = Math.random().toString(36).substr(2, 9);

		const messageHandler = (event: MessageEvent) => {
			if (event.origin !== window.origin) return;
			if (
				event.data?.requestId === requestId &&
				event.data?.action === "sendToken"
			) {
				window.removeEventListener("message", messageHandler);

				if (event.data?.token) {
					resolve(event.data.token);
				} else {
					console.log("No token received");
					resolve("");
				}
			}
		};

		window.addEventListener("message", messageHandler);

		window.parent.postMessage({ requestId, action: "getToken" }, window.origin);
	});
}

const ApiButtonView = ({ actionsData }: ApiButtonView) => {
	const tools = ["CURL"];
	const [action, setAction] = useState<string>("");
	const [tool, setTool] = useState<string>(tools[0]);
	const [actions, setActions] = useState<string[]>([]);
	const [token, setToken] = useState("");
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const [position, setPosition] = useState<PositionType>("center");
	const apiButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const actionNames = Object.keys(actionsData);
		setAction(actionNames[0]);
		setActions(actionNames);
	}, [actionsData]);

	const getToken = async () => {
		const token = await getTokenFromHost();
		setToken(token);
	};

	useEffect(() => {
		getToken();
	}, []);

	const displayApiButton = (
		<button
			type="button"
			className={"api-button"}
			onClick={() => setPosition(getPosition())}
			ref={apiButtonRef}
		>
			API <ChevronDown size={18} />
		</button>
	);

	const getPosition = () => {
		const halfFromScreenWidth = window.innerWidth / 2;
		const apiButtonPosition =
			apiButtonRef.current?.getBoundingClientRect().left;

		if (!apiButtonPosition) return "center";

		if (
			Math.abs(halfFromScreenWidth - apiButtonPosition) < 100 &&
			window.innerWidth > 200
		) {
			return "center";
		}

		return halfFromScreenWidth > apiButtonPosition ? "left" : "right";
	};

	const popupContent = action && (
		<div className="dropdown-api">
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div className="api-dialog-content">
					<CodeSnippetOptions
						tabs={actions}
						navTitle="Action"
						activeItem={action}
						setActiveItem={setAction}
					/>
					<CodeSnippetOptions
						tabs={tools}
						navTitle="Tool"
						activeItem={tool}
						setActiveItem={setTool}
					/>
				</div>
				<div className="api-dialog-snippet-wrapper">
					<CodeSnippet
						activeItem={action.toLowerCase()}
						content={actionsData[action]
							?.replaceAll("%TOKEN", token)
							.replaceAll("%ACCOUNT", user.account)
							.replaceAll("%ROLE", user.role)
							.replaceAll("%BASE_URL", baseUrls ? baseUrls[user.location] : "")}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<Popover>
			<PopoverTrigger asChild>{displayApiButton}</PopoverTrigger>
			<PopoverContent className="max-w-4xl w-[90vw]">
				{popupContent}
			</PopoverContent>
		</Popover>
	);
};

type Headers = string[][];

const initialHeaders = [
	["x-icdc-account", "%ACCOUNT"],
	["x-icdc-role", "%ROLE"],
	["x-miq-group", "%ACCOUNT.%ROLE"],
];

const formatHeaders = (headers?: Headers): string => {
	return (headers || initialHeaders)
		.reduce((acc, [headerName, headerValue]) => {
			acc.push(`-H "${headerName}: ${headerValue}"`);
			return acc;
		}, [])
		.join("");
};

export enum ActionTypes {
	TOKEN = "TOKEN",
	GET = "GET",
	CREATE = "CREATE",
	UPDATE = "UPDATE",
	DELETE = "DELETE",
	LIST = "LIST",
}

type GeneralAction = {
	actionType: ActionTypes;
	tabName?: string;
	headers?: Headers;
	url?: string;
	body?: string;
	comment?: string;
};

const tokenRequest = () => `export TOKEN="%TOKEN"`;

const getRequest = ({ headers, url = "", body, comment }: GeneralAction) =>
	`curl -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} \n%BASE_URL${url}`;

const postRequest = ({
	headers,
	url = "",
	body = "",
	comment = "",
}: GeneralAction) =>
	`curl -X POST -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} -H "Content-Type: application/json" -d \n'${body || ""}' \n%BASE_URL${url} \n${comment}`;

const updateRequest = ({
	headers,
	url = "",
	body = "",
	comment = "",
}: GeneralAction) =>
	`curl -X PUT -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} -H "Content-Type: application/json" -d \n'${body || ""}' \n%BASE_URL${url} \n${comment}`;

const deleteRequest = ({ headers, url = "", body, comment }: GeneralAction) =>
	`curl -X DELETE -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} -H "Content-Type: application/json" \n%BASE_URL${url || ""}`;

const listRequest = ({ headers, url = "", body, comment }: GeneralAction) =>
	`curl -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} \n%BASE_URL${url}`;

const ApiActions = {
	TOKEN: tokenRequest,
	GET: getRequest,
	CREATE: postRequest,
	UPDATE: updateRequest,
	DELETE: deleteRequest,
	LIST: listRequest,
} as const;

type ApiButton = {
	actions: GeneralAction[];
};

const ApiButton = ({ actions }: ApiButton) => {
	if (!actions || !Array.isArray(actions) || !actions.length) return null;

	const initialValue: Record<string, string> = {};

	const requests = actions.reduce((acc, curr) => {
		const actionHandler = ApiActions[curr.actionType];
		if (actionHandler)
			acc[curr.tabName || curr.actionType] = actionHandler(curr);
		return acc;
	}, initialValue);

	return <ApiButtonView actionsData={requests} />;
};

export default ApiButton;
