import { Box, Textarea } from "@mantine/core";
import { useCallback, useState } from "react";

export const ThreadInput = ({
  handleSubmit,
  defaultValue = "",
  placeholder = "Say something...",
}: {
  handleSubmit: (userInput: string) => void;
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
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
      </form>
    </Box>
  );
};
