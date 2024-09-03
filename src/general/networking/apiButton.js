import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Icon, Popup } from "semantic-ui-react";
import CodeSnippet from "./ApiDialog/CodeSnippet";
import CodeSnippetOptions from "./ApiDialog/CodeSnippetOptions";
import "./apiButton.scss";

const ApiButton = ({
  element,
  item,
  firewallGroup,
  user,
  providerId,
  gatewayId,
  connectionId,
  locationUrl,
}) => {
  const baseUrl = `${locationUrl}/api/compute/v1`;
  const traefikBaseUrl = `${locationUrl}/api/traefik_manager/v1`;
  const vpnBaseUrl = `${locationUrl}/api/wireguard/v1`;
  const dnsBaseUrl = `${locationUrl}/api/dns/v1`;
  const [activeItem, setActiveItem] = useState({
    action: "TOKEN",
    tool: "CURL",
  });
  const token = useSelector((state) => state.host.token);
  const [position, setPosition] = useState("center");
  const apiButtonRef = useRef();

  const returnPorts = (ports) => {
    const dashPosition = ports.indexOf("-");
    const minPort = ports.substring(0, dashPosition);
    const maxPort = ports.substring(dashPosition + 1);
    return {
      min: minPort,
      max: maxPort,
    };
  };

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

  const groupsCreate = (group) => ({
    action: "create",
    name: group.name,
  });

  const groupsDelete = (group) => ({
    action: "remove",
    name: group.name,
    id: group.id,
  });

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
  };

  const dnsRecordsCreate = (item) => {
    return dnsTypeToData[item.dnsType];
  };

  const rulesForCreate = (rule) => ({
    action: "add_firewall_rule",
    direction: rule.direction === "outbound" ? "egress" : "ingress",
    port_range_min: returnPorts(rule.port).min,
    port_range_max: returnPorts(rule.port).max,
    protocol: rule.hostProtocol?.toLowerCase(),
    network_protocol: rule.ipType,
    remote_group_id: rule.groupRule,
    security_group_id: rule.groupEms,
    source_ip_range: rule.sourceIpRange,
  });

  const rulesForDelete = (rule) => ({
    action: "remove_firewall_rule",
    id: rule.ruleEmsRef,
  });

  const routesForCreate = (route) => ({
    action: "add_route",
    destination: route.destination,
    nexthop: route.nexthop,
  });

  const vpcForDelete = (item) => ({
    action: "delete",
    id: item.netId,
  });
  const routesForDelete = (item) => ({
    action: "remove_route",
    destination: item.destination,
    nexthop: item.nexthop,
    id: item.netId,
  });

  const vmCreate = (vmInterface) => ({
    action: "add_to_port",
    nic_ids: [vmInterface.nicId],
  });

  const vmDelete = (vmInterface) => ({
    action: "remove_from_port",
    nic_id: vmInterface.nicId,
  });

  const vmNetworkCreate = (vmInterface) => ({
    action: "additional_nics",
    vms_ids: [vmInterface.nicId],
  });

  const vmNetworkDelete = (vmInterface) => ({
    action: "remove_nics",
    nics: { [vmInterface.vmId]: [vmInterface.nicId] },
  });

  const data = (item, type) => {
    switch (element) {
      case "network":
        return JSON.stringify(
          type === "create" ? networks : vpcForDelete(item),
        );
      case "vmTable":
        return JSON.stringify(
          type === "create" ? vmCreate(item) : vmDelete(item),
        );
      case "vmNetworkTable":
        return JSON.stringify(
          type === "create" ? vmNetworkCreate(item) : vmNetworkDelete(item),
        );
      case "firewall":
        return JSON.stringify(
          type === "create" ? groupsCreate(item) : groupsDelete(item),
        );
      case "rule":
        return JSON.stringify(
          type === "create" ? rulesForCreate(item) : rulesForDelete(item),
        );
      case "route": {
        return JSON.stringify(
          type === "create" ? routesForCreate(item) : routesForDelete(item),
        );
      }
      case "routes":
        return type === "create" && JSON.stringify(routesCreate);
      case "routesId":
        return type === "create" && JSON.stringify(routesCreate);
      case "certificates":
        return type === "create" && JSON.stringify(certificateCreate);
      case "certificate":
        return type === "create" && JSON.stringify(certificateCreate);
      case "vpnGateway":
        return type === "create" && JSON.stringify(gatewayCreate);
      case "vpnConnection":
        return type === "create" && JSON.stringify(vpnConnectionCreate);
      case "vpnRemoteGateways":
        return type === "create" && JSON.stringify(vpnRemoteGatewaysCreate);
      case "vpnNatMapping":
        return type === "create" && JSON.stringify(vpnNatMappingCreate);
      case "vpnDevices":
        return type === "create" && JSON.stringify(vpnDeviceCreate);
      case "dns":
        return type === "create" && JSON.stringify(dnsZonesCreate);
      case "dnsRecords":
        return type === "create" && JSON.stringify(dnsRecordsCreate(item).data);
      case "port-forwarding":
        return type === "create" && JSON.stringify(portForwardingCreate);
    }
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

  const url = () => {
    switch (element) {
      case "network":
        return `${baseUrl}/providers/${providerId}/cloud_networks/`;
      case "allFirewalls":
        return `${baseUrl}/security_groups?expand=resources`;
      case "firewall":
        return activeItem.action.toLowerCase() === "get"
          ? `${baseUrl}/security_groups/${item.id}?expand=resources\\&attributes=firewall_rules,assigned_vms`
          : `${baseUrl}${activeItem.action.toLowerCase() === "create" ? "/providers/" + providerId : ""}/security_groups`;
      case "rule":
        return `${baseUrl}/security_groups/${firewallGroup.id}${activeItem.action.toLowerCase() === "get" ? "?expand=resources\\&attributes=firewall_rules" : ""}`;
      case "vmTable":
        return `${baseUrl}/security_groups/${firewallGroup.id}`;
      case "vmNetworkTable":
        return `${baseUrl}/cloud_subnets/${firewallGroup.id}`;
      case "routes":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${traefikBaseUrl}/routes`
          : `${traefikBaseUrl}/routes/:id`;
      case "routesId":
        return `${traefikBaseUrl}/routes/:id`;
      case "route":
        return `${baseUrl}/network_routers/${providerId}`;
      case "certificates":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${traefikBaseUrl}/certificates`
          : `${traefikBaseUrl}/certificates/:id`;
      case "certificate":
        return `${traefikBaseUrl}/certificates/:id`;
      case "vpnGateway":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${vpnBaseUrl}/gateways`
          : `${vpnBaseUrl}/gateways/:id`;
      case "vpnConnection":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${vpnBaseUrl}/gateways/${gatewayId}/connections`
          : `${vpnBaseUrl}/connections/:id`;
      case "vpnRemoteGateways":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${vpnBaseUrl}/gateways/${gatewayId}/remote_gateways`
          : `${vpnBaseUrl}/remote_gateways/:id`;
      case "vpnNatMapping":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${vpnBaseUrl}/gateways/${gatewayId}/nat_maps`
          : `${vpnBaseUrl}/nat_maps/:id`;
      case "vpnDevices":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${vpnBaseUrl}/connections/${connectionId}/devices`
          : `${vpnBaseUrl}/devices/:id`;
      case "dns":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${dnsBaseUrl}/zones`
          : `${dnsBaseUrl}/zones/{zone_name}`;
      case "dnsRecords":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${dnsBaseUrl}/zones/${item.zoneName}/records`
          : `${dnsBaseUrl}/zones/${item.zoneName}/records/{id}.{record_name}`;
      case "port-forwarding":
        return activeItem.action.toLowerCase() !== "delete"
          ? `${baseUrl}/port_forwardings`
          : `${baseUrl}/port_forwardings/:id`;
    }
  };

  const displaySnippet = () => {
    /*eslint-disable*/
    switch (activeItem.action.toLowerCase()) {
      case "token":
        return `export TOKEN="${token}"`;
      case "create":
        return `curl -X POST -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" -d \n'${data(item, "create")}' \n${url()} \n${element === "dnsRecords" ? dnsRecordsCreate(item).comment : ""}`;
      case "get":
        return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
      case "delete":
        return `curl -X ${data(item, "delete") !== false ? "POST" : "DELETE"} -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" -H "Content-Type: application/json" ${data(item, "delete") !== false ? `-d '${data(item, "delete")}'` : ""} \n${url()}`;
      case "list":
        return `curl -H "Authorization: Bearer $TOKEN" -H "x-miq-group: ${user.account}.${user.role}" -H "x-icdc-account: ${user.account}" -H "x-icdc-role: ${user.role}" \n${url()}`;
    }
  };

  const copy = (value) => {
    const singleLineValue = value.replaceAll("\n", "");
    navigator.clipboard.writeText(singleLineValue).catch((err) => {
      console.log("Something went wrong", err);
    });
  };

  const determineActionsArray = () => {
    switch (element) {
      case "vmTable":
      case "vmNetworkTable":
        return ["TOKEN", "CREATE", "DELETE"];
      case "allFirewalls":
        return ["TOKEN", "LIST"];
      default:
        return ["TOKEN", "GET", "CREATE", "DELETE"];
    }
  };

  const toolsArray = ["CURL"];

  const displayApiButton = (
    <button
      type="button"
      className={"api-button"}
      onClick={() => setPosition(getPosition())}
      ref={apiButtonRef}
    >
      API <Icon name="caret down" />
    </button>
  );

  const getPosition = () => {
    const halfFromScreenWidth = window.innerWidth / 2;
    const apiButtonPosition =
      apiButtonRef.current?.getBoundingClientRect().left;

    if (
      Math.abs(halfFromScreenWidth - apiButtonPosition) < 100 &&
      window.innerWidth > 200
    ) {
      return "center";
    }

    return halfFromScreenWidth > apiButtonPosition ? "left" : "right";
  };

  const popupContent = (
    <div className="dropdown-api">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="api-dialog-content">
          <CodeSnippetOptions
            tabs={determineActionsArray()}
            navTitle="Action"
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
          <CodeSnippetOptions
            tabs={toolsArray}
            navTitle="Tool"
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </div>
        <div className="api-dialog-snippet-wrapper">
          <CodeSnippet
            activeItem={activeItem.action.toLowerCase()}
            content={displaySnippet()}
            copyFuncion={copy}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Popup
      content={popupContent}
      trigger={displayApiButton}
      on="click"
      size="tiny"
      position={`bottom ${position}`}
    />
  );
};

ApiButton.propTypes = {
  direction: PropTypes.any,
  element: PropTypes.any,
  item: PropTypes.any,
  firewallGroup: PropTypes.object,
  user: PropTypes.object,
  providerId: PropTypes.string,
  gatewayId: PropTypes.string,
  connectionId: PropTypes.string,
  locationUrl: PropTypes.string,
};

export default ApiButton;
