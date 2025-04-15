import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

type OptionType = {
	label: string;
	value: string;
};
type GeneralSelectPropsType = {
	placeholder: string;
	options: OptionType[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
};
const GeneralSelect = ({
	placeholder,
	options,
	value,
	onChange,
	className,
}: GeneralSelectPropsType) => {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className={`min-w-[180px] ${className}`}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default GeneralSelect;
