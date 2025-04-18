import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { ChevronLeft } from "lucide-react";
import { cn } from "../../shared/lib/utils";

const buttonVariants = cva(
	"relative inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"rounded-[.28571429rem] bg-primary-blue text-primary-white shadow hover:bg-primary-hv",
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline: "border border-solid bg-transparent",
				secondary:
					"bg-[#e0e1e2] text-[#0009] hover:bg-[#cacbcd] hover:text-[##000c] shadow-sm",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				back: "bg-[#e0e1e2] text-[#0009] !pl-16 hover:bg-[#cacbcd] hover:text-[##000c] overflow-hidden rounded-[.28571429rem]",
				warning: "bg-[#db2828] text-primary-white hover:bg-[#d01919]",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-9 rounded-md px-8 text-sm",
				icon: "h-9 w-9 rounded-[.28571429rem]",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, children, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{variant === "back" && (
					<span className="bg-[#0000000d] h-[36px] w-[36px] absolute left-0 top-0">
						<ChevronLeft size={24} className="absolute inset-0 m-auto" />
					</span>
				)}
				{children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
