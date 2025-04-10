import { EllipsisVertical } from "lucide-react";
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<EllipsisVertical />
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
