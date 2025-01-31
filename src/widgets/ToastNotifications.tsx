import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster, toast } from "sonner";

type ToastDetails = {
	type: "success" | "info" | "error" | "warning" | "message";
	title: string;
	description: string;
};

const ToastNotifications = () => {
	const { t } = useTranslation();

	useEffect(() => {
		const messageListener = (e: CustomEvent) => {
			const { type, title, description }: ToastDetails = e.detail;
			if (!type) return;

			toast[type](t(title || type), {
				description: t(description),
			});
		};

		window.addEventListener(
			"showNotification",
			messageListener as EventListener,
		);

		return () =>
			window.removeEventListener(
				"showNotification",
				messageListener as EventListener,
			);
	}, []);

	return <Toaster richColors expand={true} toastOptions={{ duration: 5000 }} />;
};

export default ToastNotifications;
