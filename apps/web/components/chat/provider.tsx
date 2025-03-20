"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ThreadContext } from "./context";

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const threadId = searchParams.get("threadId");

  const setThreadId = useCallback(
    (newThreadId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newThreadId) {
        params.set("threadId", newThreadId);
      } else {
        params.delete("threadId");
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const quotedThreadId = searchParams.get("quotedThreadId");

  const setQuotedThreadId = useCallback(
    (newQuotedThreadId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newQuotedThreadId) {
        params.set("quotedThreadId", newQuotedThreadId);
      } else {
        params.delete("quotedThreadId");
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <ThreadContext.Provider
      value={{
        threadId,
        setThreadId,
        quotedThreadId,
        setQuotedThreadId,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
