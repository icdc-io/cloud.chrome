import type React from "react";

type CodeSnippetOptionType = {
  name: string;
  active: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const CodeSnippetOption = ({
  name,
  active,
  handleClick,
}: CodeSnippetOptionType) => {
  return (
    <button
      className={active ? "active" : ""}
      onClick={handleClick}
      type="button"
      name={name}
    >
      {name}
    </button>
  );
};

export default CodeSnippetOption;
