import type React from "react";
import { Header } from "semantic-ui-react";
import CodeSnippetOption from "./CodeSnippetOption";

type CodeSnippetOptionsType = {
  tabs: string[];
  navTitle: string;
  activeItem: string;
  setActiveItem: (activeItem: string) => void;
};

const CodeSnippetOptions = ({
  tabs,
  navTitle,
  activeItem,
  setActiveItem,
}: CodeSnippetOptionsType) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const item = (event.target as HTMLButtonElement).name;
    setActiveItem(item);
  };

  return (
    <div
      className="navigation"
      style={navTitle === "Tool" ? { marginLeft: "20px" } : {}}
    >
      <Header as="h5" color="grey" className="title">
        {navTitle}
      </Header>
      <div style={{ display: "flex" }}>
        {tabs.map((item, key) => (
          <CodeSnippetOption
            name={item}
            key={key}
            active={activeItem === item}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CodeSnippetOptions;
