import type { FC, ReactNode } from "react";
import { cn } from "../lib/utils";

type Segment = {
	children: ReactNode;
	className?: string;
};

export const Segment: FC<Segment> = ({ children, className }) => {
	return (
		<div
			className={cn(
				"relative border-[var(--border-color)] bg-white p-4 border m-0",
				className,
			)}
		>
			{children}
		</div>
	);
};
