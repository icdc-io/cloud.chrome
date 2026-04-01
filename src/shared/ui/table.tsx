import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { useContainerBreakpoint } from "../hooks/useContainerBreakpoint";

const tableVariants = cva("", {
	variants: {
		variant: {
			responsive: "responsive",
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement> &
		VariantProps<typeof tableVariants> & {
			containerClassName?: string;
			breakpoint?: number;
		}
>(({ className, containerClassName, breakpoint, variant, ...props }, ref) => {
	const wrapperRef = React.useRef(null);
	const isCards = useContainerBreakpoint(wrapperRef, breakpoint);
	const isTableResponsive = variant === "responsive";

	const tableComponent = (
		<div
			ref={wrapperRef}
			className={cn(
				isCards && isTableResponsive ? "table-cards-mode" : "table-default",
				"overflow-auto border border-solid border-[#E2E8F0] rounded !min-h-0	",
				containerClassName,
			)}
		>
			<table
				ref={ref}
				className={cn(
					tableVariants({ variant }),
					"w-full caption-bottom text-sm border-none",
					className,
				)}
				{...props}
			/>
		</div>
	);

	if (isTableResponsive) return tableComponent;

	return (
		<div className={cn("relative w-full ", containerClassName)}>
			{tableComponent}
		</div>
	);
});
Table.displayName = "Table";

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn("[&_tr]:border-b text-[#676767]", className)}
		{...props}
	/>
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
			className,
		)}
		{...props}
	/>
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement> & {
		sorted?: "ascending" | "descending" | undefined;
		onSort?: () => void;
	}
>(({ className, sorted, onSort, children, align, ...props }, ref) => {
	return (
		<th
			ref={ref}
			className={cn(
				"h-10 px-2 text-left align-middle font-semibold [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				onSort && "sorted",
				className,
			)}
			align={align}
			{...props}
		>
			{onSort ? (
				<button
					type="button"
					onClick={onSort}
					className={`flex items-center justify-${align}`}
				>
					{children}
					{!!onSort && !sorted && (
						<>
							&nbsp;
							<ArrowDownUp size={16} />
						</>
					)}
					{sorted === "descending" && <MoveDown size={16} />}
					{sorted === "ascending" && <MoveUp size={16} />}
				</button>
			) : (
				children
			)}
		</th>
	);
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement> & {
		direction?: "col" | "row";
	}
>(({ className, children, align, direction = "col", ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			"p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-[#000000DE]",
			className,
		)}
		{...props}
		align={align}
	>
		<div
			className={cn(
				"contents",
				"[table.responsive_&]:flex responsive-cell",
				direction === "row" && "flex-row",
				direction === "col" && "flex-col",
			)}
		>
			{children}
		</div>
	</td>
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={cn("mt-4 text-base", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
};
