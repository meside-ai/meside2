import { UIMessage } from "@ai-sdk/ui-utils";
import { Box, ScrollArea, Text } from "@mantine/core";
import { AssistantHeader } from "./assistant-header";
import { MarkdownPart } from "./markdown-part";

export const ThreadRender = ({ messages }: { messages: UIMessage[] }) => {
  return (
    <Box style={{ height: "100%", overflow: "auto" }}>
      <ScrollArea scrollbars="y">
        <Box p="md">
          {messages.map((message) => (
            <Box key={message.id}>
              {message.role === "user" && (
                <Box>
                  <Text>User: </Text>
                </Box>
              )}
              {message.role === "assistant" ? <AssistantHeader /> : null}
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
            </Box>
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
};
