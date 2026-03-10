import { EllipsisVertical } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

type OptionItem<T> = {
	text: string;
	children?: OptionItem<T>[];
	action: (instance: T) => (event: Event) => void;
	color?: "red";
	disabled?: boolean;
};

type OptionSeparator = { separator: true };

type Option<T> = OptionItem<T> | OptionSeparator;

const isSeparator = <T,>(option: Option<T>): option is OptionSeparator =>
	"separator" in option && option.separator === true;

type OptionsMenuProps<T> = {
	options: Option<T>[];
	instance: T;
};

const OptionsMenu = <T,>({ options, instance }: OptionsMenuProps<T>) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const onOpenChange = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setOpen(true);
	};

	const returnOption = (option: Option<T>, key: number) =>
		isSeparator(option) ? (
			<DropdownMenuSeparator key={key} />
		) : (
			<DropdownMenuItem
				key={option.text}
				onSelect={option.action(instance)}
				color={option.color}
				disabled={option.disabled}
			>
				{t(option.text)}
			</DropdownMenuItem>
		);

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" onClick={onOpenChange}>
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options.map((option, key) =>
					isSeparator(option) ? (
						<DropdownMenuSeparator key={key} />
					) : option.children ? (
						<DropdownMenuSub key={option.text}>
							<DropdownMenuSubTrigger>{t(option.text)}</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									{option.children.map(returnOption)}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					) : (
						returnOption(option, key)
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default OptionsMenu;
