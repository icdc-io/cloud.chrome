import { Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type CopyButton = {
	content: string;
	formatText?: (content: string) => string;
	size?: number;
	buttonText?: string;
};

const CopyButton = ({
	content,
	formatText,
	size = 16,
	buttonText,
}: CopyButton) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	if (!content) return null;

	const handleOpen = () => {
		setIsOpen(true);
		setTimeout(() => {
			setIsOpen(false);
		}, 2000);
	};

	const handleClose = () => {
		setIsOpen(false);
		// clearTimeout();
	};

	const copy = (value: string) => {
		const formattedText = formatText ? formatText(value) : value;
		navigator.clipboard.writeText(formattedText).catch((err) => {
			console.log("Something went wrong", err);
		});
	};

	const copyButton = (
		<button
			onClick={() => copy(content)}
			type="button"
			className="bg-gray-100 rounded-md p-1"
		>
			{buttonText ? buttonText : <Copy size={size} />}
		</button>
	);

	const onOpenChange = (open: boolean) => {
		open ? handleOpen() : handleClose();
	};

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{copyButton}</PopoverTrigger>
			<PopoverContent className="p-2 w-auto">{t("copied")}</PopoverContent>
		</Popover>
	);
};

export default CopyButton;
