import type { RemoteApp } from "@/types/entities";
import React from "react";

const Consoles = React.lazy(() => import("@/pages/admin/Consoles"));
const ContactsPage = React.lazy(() => import("@/pages/support/ContactsPage"));

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
