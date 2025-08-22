import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement> & {
		containerClassName?: string;
	}
>(({ className, containerClassName, ...props }, ref) => (
	<div className={cn("relative w-full ", containerClassName)}>
		<div
			className={cn(
				"overflow-auto border border-solid border-[#E2E8F0] rounded !min-h-0	",
				containerClassName,
			)}
		>
			<table
				ref={ref}
				className={cn("w-full caption-bottom text-sm border-none", className)}
				{...props}
			/>
		</div>
	</div>
));
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
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
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
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			"p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-[#000000DE]",
			className,
		)}
		{...props}
	/>
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
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
