import styles from "@/styles/GeneralInput.module.css";
import { useId } from "react";

interface GeneralInputType {
	placeholder: string;
	style: {
		[key: string]: string;
	};
	dnsType: string;
	label: string;
	input: {
		[key: string]: string;
	};
	meta: {
		error: boolean;
		touched: boolean;
	};
	readOnly: boolean | undefined;
}

const GeneralInput = ({
	input,
	label,
	meta: { error, touched },
	readOnly,
	placeholder,
	style,
	dnsType,
}: GeneralInputType) => {
	const isNsField = dnsType === "NS";
	const id = useId();
	return (
		<>
			<div
				className={`${touched && error && !readOnly ? styles.error : ""} ${readOnly ? styles.readonly : ""} ${styles["form-field"]}`}
			>
				<label htmlFor={id} style={isNsField ? { opacity: 1 } : {}}>
					{label}
				</label>
				<input
					id={id}
					disabled={readOnly}
					{...input}
					placeholder={placeholder}
					value={isNsField ? "ns.dns" : input.value}
					style={style}
				/>
				{touched && error && !readOnly && (
					<div>
						<span className={styles["error-msg"]}>{error}</span>
					</div>
				)}
			</div>
		</>
	);
};

export default GeneralInput;
