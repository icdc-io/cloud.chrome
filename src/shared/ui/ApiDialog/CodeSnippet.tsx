import { Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../shared/ui/popover";

type CodeSnippetType = {
	content: string;
	copyFuncion: (content: string) => void;
	activeItem: string;
	title?: string;
};
const CodeSnippet = ({
	content,
	copyFuncion,
	activeItem,
	title = "Terminal",
}: CodeSnippetType) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(true);
		setTimeout(() => {
			setIsOpen(false);
		}, 2000);
	};

	const handleClose = () => {
		setIsOpen(false);
		// clearTimeout();
	};

	const copyButton = (
		<button onClick={() => copyFuncion(content)} type="button">
			<Copy />
		</button>
	);

	const onOpenChange = (open: boolean) => {
		open ? handleOpen() : handleClose();
	};

	return (
		<>
			<div className="header-container">
				<h5 style={{ margin: 0, color: "grey" }}>{title}</h5>
				<Popover open={isOpen} onOpenChange={onOpenChange}>
					<PopoverTrigger asChild>{copyButton}</PopoverTrigger>
					<PopoverContent className="w-80">
						{"Copied to clipboard"}
					</PopoverContent>
				</Popover>
			</div>
			<div className="code-snippet-wrapper">
				<SyntaxHighlighter
					customStyle={activeItem === "token" ? { height: "200px" } : {}}
					wrapLongLines
					wrapLines
					language="bash"
					style={base16AteliersulphurpoolLight}
				>
					{content}
				</SyntaxHighlighter>
			</div>
		</>
	);
};

export default CodeSnippet;
