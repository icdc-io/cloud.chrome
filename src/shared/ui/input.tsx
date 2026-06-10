import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
	"flex h-9 w-full rounded-md border border-input border-solid bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				search:
					"border-0 focus-visible:outline-0 focus-visible:outline-transparent focus-visible:shadow-[none]",
				default: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	asChild?: boolean;
	containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, containerClassName, variant, ...props }, ref) => {
		const input = (
			<input
				ref={ref}
				className={cn(inputVariants({ variant }), className)}
				{...props}
			/>
		);

		if (variant === "search")
			return (
				<div
					className={cn(
						"flex items-center border h-9 border-input px-3 rounded-md transition-all focus-within:ring-1 focus-within:ring-ring",
						containerClassName,
					)}
					cmdk-input-wrapper=""
				>
					<Search className="h-4 w-4 shrink-0 opacity-50" />
					{input}
				</div>
			);

		return input;
	},
);
Input.displayName = "Input";

export { Input };
