import { EllipsisVertical } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

type OptionsMenu<T> = {
	options: {
		text: string;
		action: (instance: T) => (event: Event) => void;
		color?: "red";
		disabled?: boolean;
	}[];
	instance: T;
};

const OptionsMenu = <T,>({ options, instance }: OptionsMenu<T>) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const onOpenChange = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setOpen(true);
	};

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<Button
					className="options-trigger-dots"
					variant="ghost"
					onClick={onOpenChange}
				>
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuTrigger asChild>
				<Button
					className="options-grigger-mobile"
					variant="outline"
					onClick={onOpenChange}
				>
					{t("options")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options.map((option) => (
					<DropdownMenuItem
						key={option.text}
						onSelect={option.action(instance)}
						color={option.color}
						disabled={option.disabled}
					>
						{t(option.text)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default OptionsMenu;
