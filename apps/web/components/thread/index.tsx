import { useChat } from "@ai-sdk/react";
import { TextUIPart } from "@ai-sdk/ui-utils";
import { Box, Table, Text } from "@mantine/core";
import BaseMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

export type ThreadProps = {
  //
};

export const Thread = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <Box style={{ minHeight: 200 }}>
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "reasoning":
                  return <div>Reasoning {part.reasoning}</div>;
                case "tool-invocation":
                  return (
                    <div>
                      Tool invocation {part.toolInvocation.toolName} /{" "}
                      {part.toolInvocation.toolCallId} /{" "}
                      {part.toolInvocation.state}
                      {JSON.stringify(part.toolInvocation.args)}
                    </div>
                  );
                case "text":
                  return (
                    <MarkdownPart key={`${message.id}-${i}`} part={part} />
                  );
              }
            })}
          </div>
        ))}
      </Box>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

const MarkdownPart = ({ part }: { part: TextUIPart }) => {
  return (
    <BaseMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => {
          return <Text>{children}</Text>;
        },
        table: ({ children }) => {
          return (
            <Table withTableBorder withColumnBorders withRowBorders>
              {children}
            </Table>
          );
        },
        tr: ({ children }) => {
          return <Table.Tr>{children}</Table.Tr>;
        },
        td: ({ children }) => {
          return <Table.Td>{children}</Table.Td>;
        },
        th: ({ children }) => {
          return <Table.Th>{children}</Table.Th>;
        },
        code: (props) => {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <Box style={{ borderRadius: "12px", overflow: "hidden" }}>
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                wrapLines={true}
                wrapLongLines={true}
              >
                {String(children)}
              </SyntaxHighlighter>
            </Box>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {part.text}
    </BaseMarkdown>
  );
};
