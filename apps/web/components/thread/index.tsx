import { useChat } from "@ai-sdk/react";
import { TextUIPart, UIMessage } from "@ai-sdk/ui-utils";
import { Box, Table, Text } from "@mantine/core";
import BaseMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { useThreadContext } from "../chat/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getThreadCreate,
  getThreadDetail,
  getThreadUpdate,
} from "../../queries/thread";
import { useEffect, useRef, useState } from "react";

export type ThreadProps = {
  //
};

export const Thread = () => {
  const { threadId, setThreadId } = useThreadContext();

  const { data, isLoading } = useQuery(
    getThreadDetail({ threadId: threadId ?? "" })
  );

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!data?.thread) {
    return <NewThreadInput setThreadId={setThreadId} />;
  }

  if (data.thread.status === "idle" && data.thread.messages.length === 0) {
    return (
      <NewThreadMessage
        threadId={data.thread.threadId}
        userPrompt={data.thread.userPrompt}
      />
    );
  }

  if (data.thread.status === "active" || data.thread.status === "closed") {
    return (
      <Box>
        <ThreadRender messages={data.thread.messages} />
      </Box>
    );
  }

  return <Box>Unknown issue</Box>;
};

const NewThreadMessage = ({
  threadId,
  userPrompt,
}: {
  threadId: string;
  userPrompt: string;
}) => {
  const queryClient = useQueryClient();
  const [finished, setFinished] = useState(false);
  const [errored, setErrored] = useState(false);
  const mountedRef = useRef(false);

  const { messages, input, setInput, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      threadId,
    },
    onError: () => {
      setErrored(true);
    },
    onFinish: async () => {
      setFinished(true);
    },
  });

  const { mutateAsync: updateThread } = useMutation({
    ...getThreadUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries(getThreadDetail({ threadId }));
    },
  });

  useEffect(() => {
    if (finished) {
      updateThread({
        threadId,
        status: "active",
        messages,
      });
    }
  }, [finished, threadId, messages, updateThread]);

  useEffect(() => {
    if (errored) {
      updateThread({
        threadId,
        status: "closed",
        messages,
      });
    }
  }, [errored, threadId, messages, updateThread]);

  useEffect(() => {
    if (mountedRef.current) {
      return;
    }
    setInput(userPrompt);
    mountedRef.current = true;
  }, [setInput, userPrompt]);

  const mountedRef2 = useRef(false);

  useEffect(() => {
    if (mountedRef2.current) {
      return;
    }
    if (input) {
      handleSubmit();
      mountedRef2.current = true;
    }
  }, [input, handleSubmit]);

  return (
    <Box>
      <ThreadRender messages={messages} />
    </Box>
  );
};

const NewThreadInput = ({
  setThreadId,
}: {
  setThreadId: (threadId: string) => void;
}) => {
  const [newThreadInput, setNewThreadInput] = useState("");
  const { mutateAsync: createNewThread } = useMutation(getThreadCreate());
  return (
    <ThreadInput
      input={newThreadInput}
      handleInputChange={(e) => setNewThreadInput(e.target.value)}
      handleSubmit={async (event) => {
        event.preventDefault();
        const json = await createNewThread({
          versionId: null,
          systemPrompt: "",
          userPrompt: newThreadInput,
          parentThreadId: null,
        });
        setNewThreadInput("");
        setThreadId(json.thread.threadId);
      }}
      placeholder="Create a new thread"
    />
  );
};

const ThreadInput = ({
  input,
  handleInputChange,
  handleSubmit,
  placeholder = "Say something...",
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}) => {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

const ThreadRender = ({ messages }: { messages: UIMessage[] }) => {
  return (
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
                return <MarkdownPart key={`${message.id}-${i}`} part={part} />;
            }
          })}
        </div>
      ))}
    </Box>
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
