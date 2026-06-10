import styles from "@/styles/TitleWithCounter.module.css";

const TitleWithCounter = ({
	title,
	counter,
}: {
	title: string;
	counter: number;
}) => {
	return (
		<div className="flex items-center mb-3.5">
			<h2 className="text-2xl font-semibold">{title}</h2>
			{(counter || +counter === 0) && (
				<span className={styles.mark}>{counter}</span>
			)}
		</div>
	);
};

export { TitleWithCounter };
