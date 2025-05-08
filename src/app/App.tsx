import useAuth from "@/shared/hooks/useAuth";
import React from "react";

const Layout = React.lazy(() => import("@/widgets/Layout"));

const App = () => {
	useAuth();

	return <Layout />;
};

export default App;
