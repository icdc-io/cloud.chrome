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
import { useDebounce } from "../hooks/useDebounce";

type Option = {
	value: string;
	text: string;
};

type Combobox = {
	options: Option[];
	placeholder: string;
	onOpenChange?: (isOpen: boolean) => void;
	onValueChange: (value: string | number | undefined) => void;
	open?: boolean;
	value: string;
	shouldFilter?: boolean;
	searchQueryFn?: (query: string) => void;
	formatOption?: (option: Option) => React.ReactNode;
	emptyMessage?: string | React.ReactNode;
	onQueryChange?: (query: string) => void;
	minValueLength?: number;
	isLoading?: boolean;
	disabled?: boolean;
	unClearable?: boolean;
	className?: string;
};

export function Combobox({
	options,
	placeholder,
	onOpenChange,
	onValueChange,
	open,
	value,
	shouldFilter = true,
	searchQueryFn,
	formatOption,
	emptyMessage,
	onQueryChange,
	minValueLength,
	isLoading,
	disabled,
	unClearable = false,
	className = "",
}: Combobox) {
	const { t } = useTranslation();
	const [localOpen, setLocalOpen] = React.useState(false);
	const [localValue, setLocalValue] = React.useState("");
	const [searchQuery, setSearchQuery] = React.useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 0);
	const isOptionNumber = typeof options[0]?.value === "number";
	const formattedOptions = options.map((item) => ({
		...item,
		value: item.value ? item.value + "" : item.value,
		text: item.text + "",
	}));
	const formattedValue = value ? value + "" : value;

	React.useEffect(() => {
		if (!searchQueryFn) return;
		if (!minValueLength) return searchQueryFn(debouncedSearchQuery);
		if (debouncedSearchQuery.length >= minValueLength)
			searchQueryFn(debouncedSearchQuery);
		return;
	}, [debouncedSearchQuery]);

	React.useEffect(() => {
		if (!formattedValue) return;
		setLocalValue(formattedValue);
	}, [formattedValue]);

	React.useEffect(() => {
		onOpenChange?.(localOpen);
	}, [localOpen]);

	React.useEffect(() => {
		onQueryChange?.(searchQuery);
	}, [searchQuery]);

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
		? formattedOptions.find((option) => option.value === localValue)?.text
		: "";

	const onSelect = (currentValue: string) => {
		const newValueText =
			currentValue === localValue && !unClearable ? "" : currentValue;
		const newValue = formattedOptions.find(
			(item) => item.text === newValueText,
		)?.value;

		if (!newValue) return;
		if (shouldFilter !== false) setLocalValue(newValue);
		const formattedValue = isOptionNumber ? +newValue : newValue;
		onValueChange(Number.isNaN(formattedValue) ? undefined : formattedValue);
		setLocalOpen(false);
	};

	return (
		<Popover open={localOpen} onOpenChange={setLocalOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={localOpen}
					className={cn(
						"w-full justify-between font-medium border border-input",
						className,
					)}
					{...placeholderAttribute}
					disabled={disabled}
				>
					{currentOption || t(placeholder)}
					<ChevronsUpDown className="h-4 w-4 opacity-50" size={16} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command shouldFilter={shouldFilter}>
					<CommandInput
						isLoading={isLoading}
						placeholder={t(placeholder)}
						value={searchQuery}
						onValueChange={setSearchQuery}
						className="h-9 !outline-0 !outline-none border-none"
					/>
					<CommandList>
						{(minValueLength && minValueLength > searchQuery.length) ||
						isLoading ? null : (
							<CommandEmpty>{emptyMessage || t("noOptions")}</CommandEmpty>
						)}
						<CommandGroup>
							{formattedOptions.map((option) => (
								<CommandItem
									key={option.value}
									value={option.text}
									onSelect={onSelect}
								>
									{formatOption?.(option) || option.text}
									<Check
										className={cn(
											"ml-auto",
											formattedValue === option.value
												? "opacity-100"
												: "opacity-0",
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
