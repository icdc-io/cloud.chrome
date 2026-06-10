import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot, type Root } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "@/redux/store";
import { i18nInstance } from "@/shared/translations/i18n";
import Layout, { type LayoutProps } from "@/widgets/Layout";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 60 * 60 * 1000,
			gcTime: 60 * 60 * 1000,
			retry: 3,
		},
	},
});

export function mount(
	opts: LayoutProps & { element: HTMLElement },
): () => void {
	const { element, ...layoutProps } = opts;
	const root: Root = createRoot(opts.element);
	root.render(
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<Router>
					<I18nextProvider i18n={i18nInstance}>
						<Layout {...layoutProps} />
					</I18nextProvider>
				</Router>
			</Provider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>,
	);
	return () => root.unmount();
}
