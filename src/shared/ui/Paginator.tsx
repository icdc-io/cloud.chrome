import type { FC } from "react";
import {
	Pagination,
	PaginationButton,
	PaginationButtonNext,
	PaginationButtonPrevious,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "./pagination";

type PaginatorProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (pageNumber: number) => void;
	containerClassName?: string;
};

const Paginator: FC<PaginatorProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	containerClassName,
}) => {
	const handlePageChange = (page: number) => {
		if (page !== currentPage) {
			onPageChange(page);
		}
	};

	const generatePaginationLinks = () => {
		const links = [];
		const neighbors = 1;

		if (currentPage > 1) {
			links.push(
				<PaginationItem key="prev">
					<PaginationButtonPrevious
						onClick={() => handlePageChange(currentPage - 1)}
					/>
				</PaginationItem>,
			);
		}

		if (currentPage >= neighbors + 2) {
			links.push(
				<PaginationItem key={1}>
					<PaginationButton onClick={() => handlePageChange(1)}>
						1
					</PaginationButton>
				</PaginationItem>,
			);
		}

		if (currentPage > neighbors + 2) {
			links.push(
				<PaginationItem key="start-ellipsis">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		for (
			let i = Math.max(1, currentPage - neighbors);
			i <= Math.min(totalPages, currentPage + neighbors);
			i++
		) {
			if (i === currentPage) {
				links.push(
					<PaginationItem key={i}>
						<PaginationButton isActive>{i}</PaginationButton>
					</PaginationItem>,
				);
			} else {
				links.push(
					<PaginationItem key={i}>
						<PaginationButton onClick={() => handlePageChange(i)}>
							{i}
						</PaginationButton>
					</PaginationItem>,
				);
			}
		}

		if (currentPage < totalPages - neighbors - 1) {
			links.push(
				<PaginationItem key="end-ellipsis">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		if (currentPage <= totalPages - neighbors - 1) {
			links.push(
				<PaginationItem key={totalPages}>
					<PaginationButton onClick={() => handlePageChange(totalPages)}>
						{totalPages}
					</PaginationButton>
				</PaginationItem>,
			);
		}

		if (currentPage < totalPages) {
			links.push(
				<PaginationItem key="next">
					<PaginationButtonNext
						onClick={() => handlePageChange(currentPage + 1)}
					/>
				</PaginationItem>,
			);
		}

		return links;
	};

	return (
		<Pagination className={containerClassName}>
			<PaginationContent>{generatePaginationLinks()}</PaginationContent>
		</Pagination>
	);
};

export default Paginator;
