import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const loaderVariants = cva("", {
	variants: {
		variant: {
			fixed: "w-full h-full max-h-12 max-w-12",
			default: "h-12 w-12",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const Loader = ({
	variant = "default",
}: VariantProps<typeof loaderVariants>) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div
				className={cn(
					"flex flex-col items-center space-y-4",
					loaderVariants({ variant }),
				)}
			>
				<div
					className={cn(
						"animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 w-full h-full max-h-12 max-w-12 icdc-loader",
						loaderVariants({ variant }),
					)}
				/>
				{/* <p className="text-gray-500 dark:text-gray-400">{t("loading")}</p> */}
			</div>
		</div>
	);
};

export default Loader;
