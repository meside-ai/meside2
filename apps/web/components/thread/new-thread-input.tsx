import { Paper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { getThreadCreate } from "../../queries/thread";
import { ThreadInput } from "./thread-input";

export const NewThreadInput = ({
  setThreadId,
}: {
  setThreadId: (threadId: string) => void;
}) => {
  const { mutateAsync: createNewThread } = useMutation(getThreadCreate());
  return (
    <Paper withBorder p="md">
      <ThreadInput
        handleSubmit={async (userInput) => {
          const json = await createNewThread({
            versionId: null,
            systemPrompt: "",
            userPrompt: userInput,
            parentThreadId: null,
          });
          setThreadId(json.thread.threadId);
        }}
        placeholder="Create a new thread"
      />
    </Paper>
  );
};
