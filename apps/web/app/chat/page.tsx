"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getTheme } from "./theme";
import { Chat } from "../../components/chat";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../utils/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MantineProvider theme={getTheme()}>
        <Notifications />
        <Chat />
      </MantineProvider>
    </QueryClientProvider>
  );
}
