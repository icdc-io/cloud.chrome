import useAuth from "@/shared/hooks/useAuth";
import React from "react";

const Layout = React.lazy(() => import("@/widgets/Layout"));

const App = () => {
	console.log(import.meta.env.REACT_APP_KEYCLOAK_URL);
	useAuth();

	return <Layout />;
};

export default App;
