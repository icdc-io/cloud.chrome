import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

type Option = {
	value: string;
	text: string;
};

type Combobox = {
	options: Option[];
	placeholder: string;
	onOpenChange?: (isOpen: boolean) => void;
	onValueChange: (value: string) => void;
	open?: boolean;
	value: string;
};

export function Combobox({
	options,
	placeholder,
	onOpenChange,
	onValueChange,
	open,
	value,
}: Combobox) {
	const { t } = useTranslation();
	const [localOpen, setLocalOpen] = React.useState(false);
	const [localValue, setLocalValue] = React.useState("");

	React.useEffect(() => {
		if (!value) return;
		setLocalValue(value);
	}, [value]);

	React.useEffect(() => {
		onOpenChange?.(localOpen);
	}, [localOpen]);

	React.useEffect(() => {
		onValueChange(localValue);
	}, [localValue]);

	React.useEffect(() => {
		if (open === undefined) return;
		setLocalOpen(open);
	}, [open]);

	const placeholderAttribute = localValue
		? {}
		: {
				"data-placeholder": true,
			};

	const currentOption = localValue
		? options.find((option) => option.value === localValue)?.text
		: "";

	return (
		<Popover open={localOpen} onOpenChange={setLocalOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={localOpen}
					className="w-full justify-between font-medium border border-input"
					{...placeholderAttribute}
				>
					{currentOption || t(placeholder)}
					<ChevronsUpDown className="h-4 w-4 opacity-50" size={16} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
					<CommandInput
						placeholder={t(placeholder)}
						className="h-9 !outline-0 !outline-none border-none"
					/>
					<CommandList>
						<CommandEmpty>{t("noOptions")}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										setLocalValue(
											currentValue === localValue ? "" : currentValue,
										);
										setLocalOpen(false);
									}}
								>
									{option.text}
									<Check
										className={cn(
											"ml-auto",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
