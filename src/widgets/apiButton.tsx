import { useAppSelector } from "@/redux/store";
import CodeSnippet from "@/shared/ui/ApiDialog/CodeSnippet";
import CodeSnippetOptions from "@/shared/ui/ApiDialog/CodeSnippetOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "@/styles/apiButton.scss";

const networks = {
	action: "create",
	name: "loc_icdc_name",
	subnet: {
		cidr: "10.208.25.0/24",
		ip_version: 4,
		network_protocol: "ipv4",
		dns_nameservers: ["213.222.50.226"],
		name: "loc_icdc_name_subnet",
	},
};

const dnsZonesCreate = {
	name: "zone_name",
	metadata: {
		account: "account_name",
		owner: "user@example.com",
		zone: true,
		service: true,
	},
};

const dnsTypeToData = {
	A: {
		data: {
			type: "A",
			name: "rec_name",
			data: "10.10.10.10",
			ttl: 300,
		},
		comment: "",
	},
	AAAA: {
		data: {
			type: "AAAA",
			name: "rec_name",
			data: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
			ttl: 300,
		},
		comment: "",
	},
	CNAME: {
		data: {
			type: "CNAME",
			name: "rec_name",
			data: "hostname",
			ttl: 300,
		},
		comment: "",
	},
	TXT: {
		data: {
			type: "TXT",
			name: "rec_name",
			data: "text",
			ttl: 300,
		},
		comment: "",
	},
	SRV: {
		data: {
			type: "SRV",
			name: "rec_name",
			data: "hostname",
			ttl: 300,
			weight: "10",
			priority: "10",
			port: "1600",
		},
		comment: "# weight, priority-optional fields",
	},
	MX: {
		data: {
			type: "MX",
			name: "rec_name",
			data: "ip/hostname",
			priority: "10",
			ttl: 300,
		},
		comment: "# priority - optional field",
	},
	NS: {
		data: {
			type: "NS",
			name: "rec_name.ns.dns",
			data: "10.10.10.10",
			ttl: 300,
		},
		comment: "# name MUST contain .ns.dns",
	},
} as const;

const instanceCreate = {
	name: "prod-db",
	engine: "1",
	version: "8.0.26",
	master_username: "admin",
	master_password: "master_password",
	cpu: "1",
	ram: "2",
	disk_size: "20",
	subnet_ids: "ycz_icdc_base",
	sg_id: "ycz_icdc_dbaas",
	public_access: true,
	parameter_group_id: "3",
	init_db: "hello_db",
	delete_protection: true,
	backup_enabled: true,
	retenntion_period: "10",
	backup_window: "12:00",
	maintenance_window: true,
	start_day: "Monday",
	start_time: "12:00",
	duration: "4",
};

const parameterGroupsCreate = {
	description: "Default parameter group for mysql8.0",
	engine: 1,
	inherit_from: 1,
	name: "default.mysql8.0",
};

const vpnDeviceCreate = {
	name: "John Doe Notebook",
	ip: "10.207.0.6",
	public_key: "string",
	keepalived: "25",
	enabled: true,
	subnets: "10.10.10.0/24,10.10.20.0/24",
	owner: "johnDoe@ibagroup.eu",
};

const vpnNatMappingCreate = {
	vpn_ip: "10.253.25.131",
	local_ip: "198.18.0.5",
	host: "engine-ovirt",
};

const vpnRemoteGatewaysCreate = {
	name: "zby",
	endpoint: "sys.vpn.zby.icdc.io",
	ip: "10.253.25.1/24",
	public_key: "string",
	subnets: "10.254.64.0/24,10.254.0.0/19",
};

const vpnConnectionCreate = {
	name: "test connection",
	ip: "10.207.0.1/24",
	port: "2200",
	mtu: "1420",
};

const gatewayCreate = {
	name: "cloudgw-a843bf2a",
	public_key: "string",
	private_key: "string",
	hostname: "acc.vpn.loc.icdc.io",
	nat_subnet: "10.253.25.128/25",
};

const routesCreate = {
	route: {
		name: "route_name",
		hostname: "acc.vpn.loc.icdc.io",
		target_port: "443",
		tls_termination: "re-encrypt",
		owner: " user@example.com",
		cloud_gateway_id: "1",
		path: "/",
		source_proto: "tcp",
		destination_proto: "tcp",
		ip_version: "4",
		services: [
			{
				id: "1",
			},
		],
		certificate_id: "1",
		insecure: "redirect",
	},
};

const certificateCreate = {
	name: "test.zby.icdc.io",
	cert: `-----BEGIN CERTIFICATE-----
      /*certificate content here*/
      -----END CERTIFICATE-----`,
	key: `-----BEGIN PRIVATE KEY-----
      /*private key content here*/
      -----END PRIVATE KEY-----`,
	ca: "",
	dest_ca: "",
	owner: " user@example.com",
};

const portForwardingCreate = {
	service_id: "26000000000123",
	name: "port_forwarding_name",
	internal_ip: "192.168.123.123",
	protocol: "TCP",
	internal_port: "123",
	external_port: "123",
};

type PositionType = "left" | "right" | "center";

type RouteType = {
	id: number;
	destination: string;
	nexthop: string;
	netId: number;
};

type DnsRecordType = {
	id: number;
	dnsType: keyof typeof dnsTypeToData;
	zoneName: string;
};

type GroupType = {
	id: number;
	name: string;
};

type VmInterfaceType = {
	nicId: number;
	vmId: number;
};

type FirewallGroupType = {
	id: number;
};

type VpcType = {
	id: number;
	netId: number;
};

type UserType = {
	account: string;
	location: string;
	role: string;
};

type RuleType = {
	direction: string;
	port: string;
	hostProtocol?: string;
	ipType: string;
	groupRule: string;
	groupEms: string;
	sourceIpRange: string;
	ruleEmsRef: string;
};

type ItemType =
	| RouteType
	| DnsRecordType
	| GroupType
	| VpcType
	| {
			[key: string]: unknown;
	  };

type Network = "network";
type VmTable = "vmTable";
type VmNetworkTable = "vmNetworkTable";
type Firewall = "firewall";
type Rule = "rule";
type Route = "route";
type Routes = "routes";
type RoutesId = "routesId";
type Certificates = "certificates";
type Certificate = "certificate";
type VpnGateway = "vpnGateway";
type VpnConnection = "vpnConnection";
type VpnRemoteGateways = "vpnRemoteGateways";
type VpnNatMapping = "vpnNatMapping";
type VpnDevices = "vpnDevices";
type Dns = "dns";
type DnsRecords = "dnsRecords";
type PortForwarding = "port-forwarding";
type ParameterGroups = "parameterGroups";
type Instances = "instances";
type Snapshots = "snapshots";
type AllFirewalls = "allFirewalls";
type ParamsList = "paramsList";
type Logs = "logs";

type ElementType =
	| VmTable
	| VmNetworkTable
	| Rule
	| Routes
	| RoutesId
	| Certificates
	| Certificate
	| VpnGateway
	| VpnConnection
	| VpnRemoteGateways
	| VpnNatMapping
	| VpnDevices
	| Dns
	| PortForwarding
	| ParameterGroups
	| Instances
	| Snapshots
	| AllFirewalls
	| ParamsList
	| Logs;

type RouteElementWithItem = {
	element: Route;
	item: RouteType;
};

type VpcElementWithItem = {
	element: Network;
	item: VpcType;
};

type DnsElementWithItem = {
	element: DnsRecords;
	item: DnsRecordType;
};

type GroupElementWithItem = {
	firewallGroup: FirewallGroupType;
	element: Firewall;
	item: GroupType;
};

type GeneralElementWithItem = {
	element: ElementType;
	item: {
		[key: string]: unknown;
	};
};

type ElementWithItem =
	| RouteElementWithItem
	| VpcElementWithItem
	| DnsElementWithItem
	| GroupElementWithItem
	| GeneralElementWithItem;

type ApiButtonType = {
	// element: ElementType;
	// item: ItemType;
	user: UserType;
	providerId?: number;
	gatewayId?: number;
	connectionId?: number;
	locationUrl: string;
	service: string;
	actions?: string[];
} & ElementWithItem;

type ActionsData = {
	[key: string]: string;
};

type ApiButtonView = {
	actionsData: ActionsData;
};

type ActiveItem = {
	action: string;
	tool: string;
} | null;

const ApiButtonView = ({ actionsData }: ApiButtonView) => {
	// const baseUrl = `${locationUrl}/api/compute/v1`;
	// const traefikBaseUrl = `${locationUrl}/api/traefik_manager/v1`;
	// const vpnBaseUrl = `${locationUrl}/api/wireguard/v1`;
	// const dnsBaseUrl = `${locationUrl}/api/dns/v1`;
	// const databaseBaseUrl = `${locationUrl}/api/database/v1`;
	const tools = ["CURL"];
	const [action, setAction] = useState<string>("");
	const [tool, setTool] = useState<string>(tools[0]);
	const [actions, setActions] = useState<string[]>([]);
	const token = useAppSelector((state) => state.host.token);
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const [position, setPosition] = useState<PositionType>("center");
	const apiButtonRef = useRef<HTMLButtonElement>(null);

	const returnPorts = (ports: string) => {
		const dashPosition = ports.indexOf("-");
		const minPort = ports.substring(0, dashPosition);
		const maxPort = ports.substring(dashPosition + 1);
		return {
			min: minPort,
			max: maxPort,
		};
	};

	useEffect(() => {
		const actionNames = Object.keys(actionsData);
		setAction(actionNames[0]);
		setActions(actionNames);
	}, [actionsData]);

	// const groupsCreate = (group: GroupType) => ({
	//   action: "create",
	//   name: group.name,
	// });

	// const groupsDelete = (group: GroupType) => ({
	//   action: "remove",
	//   name: group.name,
	//   id: group.id,
	// });

	// const dnsRecordsCreate = (item: DnsRecordType) => {
	//   return dnsTypeToData[item.dnsType];
	// };

	// const rulesForCreate = (rule: RuleType) => ({
	//   action: "add_firewall_rule",
	//   direction: rule.direction === "outbound" ? "egress" : "ingress",
	//   port_range_min: returnPorts(rule.port).min,
	//   port_range_max: returnPorts(rule.port).max,
	//   protocol: rule.hostProtocol?.toLowerCase(),
	//   network_protocol: rule.ipType,
	//   remote_group_id: rule.groupRule,
	//   security_group_id: rule.groupEms,
	//   source_ip_range: rule.sourceIpRange,
	// });

	// const rulesForDelete = (rule: RuleType) => ({
	//   action: "remove_firewall_rule",
	//   id: rule.ruleEmsRef,
	// });

	// const routesForCreate = (route: RouteType) => ({
	//   action: "add_route",
	//   destination: route.destination,
	//   nexthop: route.nexthop,
	// });

	// const vpcForDelete = (item: VpcType) => ({
	//   action: "delete",
	//   id: item.netId,
	// });
	// const routesForDelete = (item: RouteType) => ({
	//   action: "remove_route",
	//   destination: item.destination,
	//   nexthop: item.nexthop,
	//   id: item.netId,
	// });

	// const vmCreate = (vmInterface: VmInterfaceType) => ({
	//   action: "add_to_port",
	//   nic_ids: [vmInterface.nicId],
	// });

	// const vmDelete = (vmInterface: VmInterfaceType) => ({
	//   action: "remove_from_port",
	//   nic_id: vmInterface.nicId,
	// });

	// const vmNetworkCreate = (vmInterface: VmInterfaceType) => ({
	//   action: "additional_nics",
	//   vms_ids: [vmInterface.nicId],
	// });

	// const vmNetworkDelete = (vmInterface: VmInterfaceType) => ({
	//   action: "remove_nics",
	//   nics: { [vmInterface.vmId]: [vmInterface.nicId] },
	// });

	// const data = (item: ItemType, type: string) => {
	//   switch (element) {
	//     case "network":
	//       return JSON.stringify(
	//         type === "create" ? networks : vpcForDelete(item as VpcType),
	//       );
	//     case "vmTable":
	//       return JSON.stringify(
	//         type === "create"
	//           ? vmCreate(item as VmInterfaceType)
	//           : vmDelete(item as VmInterfaceType),
	//       );
	//     case "vmNetworkTable":
	//       return JSON.stringify(
	//         type === "create"
	//           ? vmNetworkCreate(item as VmInterfaceType)
	//           : vmNetworkDelete(item as VmInterfaceType),
	//       );
	//     case "firewall":
	//       return JSON.stringify(
	//         type === "create"
	//           ? groupsCreate(item as GroupType)
	//           : groupsDelete(item as GroupType),
	//       );
	//     case "rule":
	//       return JSON.stringify(
	//         type === "create"
	//           ? rulesForCreate(item as RuleType)
	//           : rulesForDelete(item as RuleType),
	//       );
	//     case "route": {
	//       return JSON.stringify(
	//         type === "create"
	//           ? routesForCreate(item as RouteType)
	//           : routesForDelete(item as RouteType),
	//       );
	//     }
	//     case "routes":
	//       return type === "create" && JSON.stringify(routesCreate);
	//     case "routesId":
	//       return type === "create" && JSON.stringify(routesCreate);
	//     case "certificates":
	//       return type === "create" && JSON.stringify(certificateCreate);
	//     case "certificate":
	//       return type === "create" && JSON.stringify(certificateCreate);
	//     case "vpnGateway":
	//       return type === "create" && JSON.stringify(gatewayCreate);
	//     case "vpnConnection":
	//       return type === "create" && JSON.stringify(vpnConnectionCreate);
	//     case "vpnRemoteGateways":
	//       return type === "create" && JSON.stringify(vpnRemoteGatewaysCreate);
	//     case "vpnNatMapping":
	//       return type === "create" && JSON.stringify(vpnNatMappingCreate);
	//     case "vpnDevices":
	//       return type === "create" && JSON.stringify(vpnDeviceCreate);
	//     case "dns":
	//       return type === "create" && JSON.stringify(dnsZonesCreate);
	//     case "dnsRecords":
	//       return (
	//         type === "create" &&
	//         JSON.stringify(dnsRecordsCreate(item as DnsRecordType).data)
	//       );
	//     case "port-forwarding":
	//       return type === "create" && JSON.stringify(portForwardingCreate);
	//     case "parameterGroups":
	//       return type === "create" && JSON.stringify(parameterGroupsCreate);
	//     case "instances":
	//       return type === "create" && JSON.stringify(instanceCreate);
	//     case "snapshots":
	//       return type === "create" && JSON.stringify({});
	//   }
	// };

	// const url = () => {
	//   switch (element) {
	//     case "network":
	//       return `${baseUrl}/providers/${providerId}/cloud_networks/`;
	//     case "allFirewalls":
	//       return `${baseUrl}/security_groups?expand=resources`;
	//     case "firewall":
	//       return activeItem.action.toLowerCase() === "get"
	//         ? `${baseUrl}/security_groups/${item.id}?expand=resources\\&attributes=firewall_rules,assigned_vms`
	//         : `${baseUrl}${activeItem.action.toLowerCase() === "create" ? "/providers/" + providerId : ""}/security_groups`;
	//     case "rule":
	//       return `${baseUrl}/security_groups/${firewallGroup?.id}${activeItem.action.toLowerCase() === "get" ? "?expand=resources\\&attributes=firewall_rules" : ""}`;
	//     case "vmTable":
	//       return `${baseUrl}/security_groups/${firewallGroup?.id}`;
	//     case "vmNetworkTable":
	//       return `${baseUrl}/cloud_subnets/${firewallGroup?.id}`;
	//     case "routes":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${traefikBaseUrl}/routes`
	//         : `${traefikBaseUrl}/routes/:id`;
	//     case "routesId":
	//       return `${traefikBaseUrl}/routes/:id`;
	//     case "route":
	//       return `${baseUrl}/network_routers/${providerId}`;
	//     case "certificates":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${traefikBaseUrl}/certificates`
	//         : `${traefikBaseUrl}/certificates/:id`;
	//     case "certificate":
	//       return `${traefikBaseUrl}/certificates/:id`;
	//     case "vpnGateway":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${vpnBaseUrl}/gateways`
	//         : `${vpnBaseUrl}/gateways/:id`;
	//     case "vpnConnection":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${vpnBaseUrl}/gateways/${gatewayId}/connections`
	//         : `${vpnBaseUrl}/connections/:id`;
	//     case "vpnRemoteGateways":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${vpnBaseUrl}/gateways/${gatewayId}/remote_gateways`
	//         : `${vpnBaseUrl}/remote_gateways/:id`;
	//     case "vpnNatMapping":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${vpnBaseUrl}/gateways/${gatewayId}/nat_maps`
	//         : `${vpnBaseUrl}/nat_maps/:id`;
	//     case "vpnDevices":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${vpnBaseUrl}/connections/${connectionId}/devices`
	//         : `${vpnBaseUrl}/devices/:id`;
	//     case "dns":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${dnsBaseUrl}/zones`
	//         : `${dnsBaseUrl}/zones/{zone_name}`;
	//     case "dnsRecords":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${dnsBaseUrl}/zones/${item.zoneName}/records`
	//         : `${dnsBaseUrl}/zones/${item.zoneName}/records/{id}.{record_name}`;
	//     case "port-forwarding":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${baseUrl}/port_forwardings`
	//         : `${baseUrl}/port_forwardings/:id`;
	//     case "parameterGroups":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${databaseBaseUrl}/parameter_groups`
	//         : `${databaseBaseUrl}/parameter_groups/:id`;
	//     case "paramsList":
	//       return `${databaseBaseUrl}/parameter_groups/:id/params`;
	//     case "instances":
	//       return activeItem.action.toLowerCase() !== "delete"
	//         ? `${databaseBaseUrl}/instances`
	//         : `${databaseBaseUrl}/instances/:instance_id`;
	//     case "snapshots":
	//       return activeItem.action.toLowerCase() !== "create"
	//         ? `${databaseBaseUrl}/snapshots`
	//         : `${databaseBaseUrl}/snapshots/:snapshot_id/restore`;
	//     case "logs":
	//       return activeItem.action.toLowerCase() !== "get :item"
	//         ? `${databaseBaseUrl}/logs`
	//         : `${databaseBaseUrl}/logs/:log_id`;
	//   }
	// };

	// const displaySnippet = () => {
	//   if (service === "database") {
	//     switch (activeItem.action.toLowerCase()) {
	//       case "token":
	//         return `export TOKEN="${token}"`;
	//       case "create":
	//         return `curl -X POST -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" -H "Content-Type: application/json" -d \n'${data(
	//           item,
	//           "create",
	//         )}' \n${url()}`;
	//       case "get":
	//         return `curl -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" \n${url()}`;
	//       case "get :item":
	//         return `curl -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" \n${url()}`;
	//       case "delete":
	//         return `curl -X ${data(item, "delete") !== false ? "POST" : "DELETE"} -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${
	//           user.role
	//         }" -H "Content-Type: application/json" \n${url()}`;
	//       case "list":
	//         return `curl -H "Authorization: Bearer $TOKEN" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
	//     }
	//   }
	//   switch (activeItem.action.toLowerCase()) {
	//     case "token":
	//       return `export TOKEN="${token}"`;
	//     case "create":
	//       return `curl -X POST -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" -d \n'${data(item, "create")}' \n${url()} \n${element === "dnsRecords" ? dnsRecordsCreate(item).comment : ""}`;
	//     case "get":
	//       return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
	//     case "delete":
	//       return `curl -X ${data(item, "delete") !== false ? "POST" : "DELETE"} -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" ${data(item, "delete") !== false ? `-d '${data(item, "delete")}'` : ""} \n${url()}`;
	//     case "list":
	//       return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
	//   }

	//   return "";
	// };

	const copy = (value: string) => {
		const singleLineValue = value.replaceAll("\n", "");
		navigator.clipboard.writeText(singleLineValue).catch((err) => {
			console.log("Something went wrong", err);
		});
	};

	// // const determineActionsArray = () => {
	// //   switch (element) {
	// //     case "vmTable":
	// //     case "vmNetworkTable":
	// //       return ["TOKEN", "CREATE", "DELETE"];
	// //     case "allFirewalls":
	// //       return ["TOKEN", "LIST"];
	// //     case "parameterGroups":
	// //       return ["TOKEN", "GET", "CREATE", "DELETE"];
	// //     case "paramsList":
	// //       return ["TOKEN", "GET"];
	// //     case "instances":
	// //       return ["TOKEN", "GET", "CREATE", "DELETE"];
	// //     case "logs":
	// //       return ["TOKEN", "GET", "GET :ITEM"];
	// //     case "snapshots":
	// //       return ["TOKEN", "GET", "CREATE"];
	// //     default:
	// //       return ["TOKEN", "GET", "CREATE", "DELETE"];
	// //   }
	// // };

	// const toolsArray = ["CURL"];

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
						copyFuncion={copy}
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

// case "token":
//   return `export TOKEN="${token}"`;
// case "create":
//   return `curl -X POST -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" -H "Content-Type: application/json" -d \n'${data(
//     item,
//     "create",
//   )}' \n${url()}`;
// case "get":
//   return `curl -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" \n${url()}`;
// case "get :item":
//   return `curl -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${user.role}" \n${url()}`;
// case "delete":
//   return `curl -X ${data(item, "delete") !== false ? "POST" : "DELETE"} -H "Authorization: Bearer $TOKEN" -H "x-auth-group: ${user.account}.${
//     user.role
//   }" -H "Content-Type: application/json" \n${url()}`;
// case "list":
//   return `curl -H "Authorization: Bearer $TOKEN" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
// }
// }
// switch (activeItem.action.toLowerCase()) {
// case "token":
// return `export TOKEN="${token}"`;
// case "create":
// return `curl -X POST -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" -d \n'${data(item, "create")}' \n${url()} \n${element === "dnsRecords" ? dnsRecordsCreate(item).comment : ""}`;
// case "get":
// return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
// case "delete":
// return `curl -X ${data(item, "delete") !== false ? "POST" : "DELETE"} -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" ${data(item, "delete") !== false ? `-d '${data(item, "delete")}'` : ""} \n${url()}`;
// case "list":
// return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
// }

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

const deleteRequest = ({ headers, url = "", body, comment }: GeneralAction) =>
	`curl -X DELETE -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} -H "Content-Type: application/json" \n%BASE_URL${url || ""}`;

const listRequest = ({ headers, url = "", body, comment }: GeneralAction) =>
	`curl -H "Authorization: Bearer $TOKEN" ${formatHeaders(headers)} \n%BASE_URL${url}`;

const ApiActions = {
	TOKEN: tokenRequest,
	GET: getRequest,
	CREATE: postRequest,
	DELETE: deleteRequest,
	LIST: listRequest,
} as const;

type ApiButton = {
	actions: GeneralAction[];
};

const ApiButton = ({ actions }: ApiButton) => {
	if (!actions || !Array.isArray(actions) || !actions.length) return null;

	const initialValue: ActionsData = {};

	const requests = actions.reduce((acc, curr) => {
		const actionHandler = ApiActions[curr.actionType];
		if (actionHandler)
			acc[curr.tabName || curr.actionType] = actionHandler(curr);
		return acc;
	}, initialValue);

	return <ApiButtonView actionsData={requests} />;
};

export default ApiButton;
