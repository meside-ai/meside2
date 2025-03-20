"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getTheme } from "./theme";
import { Chat } from "../../components/chat";

export default function ChatPage() {
  return (
    <MantineProvider theme={getTheme()}>
      <Notifications />
      <Chat />
    </MantineProvider>
  );
}
