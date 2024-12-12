import React from "react";
import type { RemoteApp } from "@/redux/types";

const Consoles = React.lazy(() => import("../components/admin/Consoles"));
const ContactsPage = React.lazy(
  () => import("../components/support/ContactsPage"),
);

type BuiltInService = RemoteApp & {
  Component: React.LazyExoticComponent<() => JSX.Element>;
};

type BuiltInServices = {
  [key: string]: BuiltInService[];
};

export const builtInServices: BuiltInServices = {
  admin: [
    { route: "consoles", name: "Admin Consoles", Component: Consoles, url: "" },
  ],
  support: [
    { route: "contacts", name: "Contacts", Component: ContactsPage, url: "" },
  ],
};
