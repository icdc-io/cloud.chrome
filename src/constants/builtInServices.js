import React from "react";

const Consoles = React.lazy(() => import("../components/admin/Consoles.jsx"));
const ContactsPage = React.lazy(
  () => import("../components/support/ContactsPage.jsx"),
);

export const builtInServices = {
  admin: [
    { route: "consoles", name: "Admin Consoles", Component: Consoles, url: "" },
  ],
  support: [
    { route: "contacts", name: "Contacts", Component: ContactsPage, url: "" },
  ],
};
