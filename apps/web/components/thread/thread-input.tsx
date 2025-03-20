import { Box, Button, Group, Loader, Textarea } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { ReactNode, useCallback, useState } from "react";

export const ThreadInput = ({
  handleSubmit,
  defaultValue = "",
  placeholder = "Say something...",
  loading = false,
  buttons,
}: {
  handleSubmit: (userInput: string) => void;
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
  buttons?: ReactNode;
}) => {
  const [input, setInput] = useState(defaultValue);
  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit(input);
      setInput("");
    },
    [handleSubmit, input]
  );

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <Textarea
          variant="unstyled"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
        />
        <Group justify="flex-end" gap="xs">
          {buttons}
          <Button type="submit" size="xs">
            {loading ? <Loader type="dots" /> : <IconArrowUp />}
          </Button>
        </Group>
      </form>
    </Box>
  );
};
