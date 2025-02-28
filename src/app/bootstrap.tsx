import App from "@/app/App";
import { store } from "@/redux/store";
import { i18nInstance } from "@/shared/translations/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: Number.POSITIVE_INFINITY,
			gcTime: Number.POSITIVE_INFINITY,
		},
	},
});
if (container) {
	const root = createRoot(container);
	root.render(
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<Router>
					<I18nextProvider i18n={i18nInstance}>
						<App />
					</I18nextProvider>
				</Router>
			</Provider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>,
	);
}
