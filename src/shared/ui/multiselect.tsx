import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type Option = {
	value: string;
	text: string;
};

interface MultiSelectProps {
	options: Option[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	emptyMessage?: string;
	className?: string;
}

export const MultiSelect = React.forwardRef<
	HTMLButtonElement,
	MultiSelectProps
>(
	(
		{
			options,
			selected,
			onChange,
			placeholder = "select",
			emptyMessage = "noOptions",
			className,
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);
		const { t } = useTranslation();

		const handleSelect = React.useCallback(
			(value: string) => {
				const updatedSelected = selected.includes(value)
					? selected.filter((item) => item !== value)
					: [...selected, value];
				onChange(updatedSelected);
			},
			[selected, onChange],
		);

		const selectedLabels = React.useMemo(
			() =>
				selected
					.map(
						(value) => options.find((option) => option.value === value)?.text,
					)
					.filter(Boolean)
					.join(", "),
			[selected, options],
		);

		const placeholderAttribute =
			selected.length > 0
				? {}
				: {
						"data-placeholder": true,
					};

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						role="combobox"
						aria-expanded={open}
						className={cn(
							"w-full justify-between font-medium border border-input",
							className,
						)}
						{...placeholderAttribute}
					>
						<span className="truncate">
							{selected.length > 0 ? selectedLabels : t(placeholder)}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
					<Command>
						<CommandInput
							placeholder={t("search")}
							className="h-9 !outline-0 !outline-none border-none"
						/>
						<CommandList>
							<CommandEmpty>{t(emptyMessage)}</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={() => handleSelect(option.value)}
									>
										{option.text}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												selected.includes(option.value)
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
	},
);
