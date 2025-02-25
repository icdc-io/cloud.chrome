import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "../CopyButton";

type CodeSnippetType = {
	content: string;
	activeItem: string;
	title?: string;
};
const CodeSnippet = ({
	content,
	activeItem,
	title = "Terminal",
}: CodeSnippetType) => {
	const copy = (value: string) => value.replaceAll("\n", "");

	return (
		<>
			<div className="header-container">
				<h5 style={{ margin: 0, color: "grey" }}>{title}</h5>
				<CopyButton size={24} content={content} formatText={copy} />
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
