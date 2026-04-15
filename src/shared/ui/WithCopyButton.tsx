import { cn } from "../lib/utils";
import CopyButton from "./CopyButton";

export const WithCopyButton = ({
	content,
	className,
}: {
	content: string;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"with-copy flex items-center gap-2 justify-between",
				className,
			)}
		>
			<span>{content}</span>
			<CopyButton content={content} />
		</div>
	);
};
