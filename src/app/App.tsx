import React from "react";
import useAuth from "@/shared/hooks/useAuth";

const Layout = React.lazy(() => import("@/widgets/Layout"));

const App = () => {
	useAuth();

	return <Layout />;
};

export default App;
