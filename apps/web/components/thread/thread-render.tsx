import { ToolInvocationUIPart, UIMessage } from "@ai-sdk/ui-utils";
import {
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import { AssistantHeader } from "./assistant-header";
import { MarkdownPart } from "./markdown-part";
import { useState } from "react";
import { useThreadContext } from "../chat/context";
import { ThreadInput } from "./thread-input";
import { IconPencil, IconTool, IconX } from "@tabler/icons-react";
import { getThreadCreate } from "../../queries/thread";
import { useMutation } from "@tanstack/react-query";
import { EditThreadInput } from "./edit-thread-input";

export const ThreadRender = ({
  messages,
  loading,
}: {
  messages: UIMessage[];
  loading?: boolean;
}) => {
  return (
    <Box style={{ height: "100%", overflow: "auto" }}>
      <ScrollArea scrollbars="y">
        <Box p="md">
          {messages.map((message) => (
            <>
              {message.role === "user" ? (
                <UserMessageRender key={message.id} message={message} />
              ) : (
                <AssistantMessageRender key={message.id} message={message} />
              )}
            </>
          ))}
          {loading && (
            <Box>
              <Loader type="dots" />
            </Box>
          )}
        </Box>
      </ScrollArea>
    </Box>
  );
};

const UserMessageRender = ({ message }: { message: UIMessage }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box mb="lg">
      {isEditing && (
        <EditThreadInput isEditing={isEditing} setIsEditing={setIsEditing} />
      )}
      {!isEditing && (
        <Box display="flex" style={{ justifyContent: "flex-end" }}>
          <Box style={{ order: 2 }} ml="lg">
            <Avatar>CW</Avatar>
          </Box>
          <Box
            style={{
              order: 1,
              textAlign: "right",
            }}
            mt={6}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <MarkdownPart key={`${message.id}-${i}`} part={part} />
                  );
              }
            })}
            <Box>
              <Button
                variant="transparent"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
                leftSection={<IconPencil size={14} />}
                mt={10}
              >
                Edit
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const AssistantMessageRender = ({ message }: { message: UIMessage }) => {
  return (
    <Box>
      <AssistantHeader />
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "reasoning":
            return <div>Reasoning {part.reasoning}</div>;
          case "tool-invocation":
            return <ToolInvocationRender part={part} />;
          case "text":
            return <MarkdownPart key={`${message.id}-${i}`} part={part} />;
        }
      })}
    </Box>
  );
};

const ToolInvocationRender = ({ part }: { part: ToolInvocationUIPart }) => {
  return (
    <Box
      style={{ backgroundColor: "#eee", padding: "10px", borderRadius: "5px" }}
      mb="sm"
    >
      <Group gap="sm">
        <IconTool size={14} />
        <Text>{part.toolInvocation.toolName}</Text>
      </Group>
      <Text size="xs">{JSON.stringify(part.toolInvocation.args, null, 2)}</Text>
    </Box>
  );
};
