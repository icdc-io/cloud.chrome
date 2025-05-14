import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

type Progress = {
	total?: number;
};

const getProgressColor = (value: number, total: number | undefined) => {
	if (!total || !value) return "";
	return value > 0.9
		? "bg-[var(--red)]"
		: value < 0.7
			? "bg-[var(--green)]"
			: "bg-[var(--yellow)]";
};

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & Progress
>(({ className, value, total = 0, ...props }, ref) => {
	const protectedValue = value ? +value : 0;
	const progressValue = total ? protectedValue / total : protectedValue;
	const bgColor = getProgressColor(progressValue, total);

	return (
		<div>
			{/* {total && (
				<div>
					{value} / {total}
				</div>
			)} */}
			<ProgressPrimitive.Root
				ref={ref}
				className={cn(
					"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
					className,
				)}
				{...props}
			>
				<ProgressPrimitive.Indicator
					className={cn("h-full w-full flex-1 transition-all", bgColor)}
					style={{
						transform: `translateX(-${progressValue ? 100 - progressValue * 100 : 0}%)`,
					}}
				/>
			</ProgressPrimitive.Root>
		</div>
	);
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
