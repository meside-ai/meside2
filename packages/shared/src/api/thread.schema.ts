import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";

// main
export const threadDtoSchema = z.object({
  threadId: z.string(),
  versionId: z.string(),
  activeVersion: z.boolean(),
  ownerId: z.string(),
  orgId: z.string(),
  shortName: z.string(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
  messages: z.any(),
  status: z.enum(["idle", "active", "closed"]),
  parentThreadId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  owner: userDtoSchema.optional(),
  siblingIds: z.array(z.string()).optional(),
});

export type ThreadDto = z.infer<typeof threadDtoSchema>;

// questionList
export const threadListRequestSchema = z.object({
  parentThreadId: z.string().optional().nullable(),
});

export const threadListResponseSchema = z.object({
  threads: z.array(threadDtoSchema),
});

export type ThreadListRequest = z.infer<typeof threadListRequestSchema>;
export type ThreadListResponse = z.infer<typeof threadListResponseSchema>;

export const threadListRoute = createRoute({
  method: "post",
  path: "/thread/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadListResponseSchema,
        },
      },
      description: "Retrieve the thread list",
    },
  },
});

// threadDetail
export const threadDetailRequestSchema = z.object({
  threadId: z.string(),
});

export const threadDetailResponseSchema = z.object({
  thread: threadDtoSchema.nullable(),
});

export type ThreadDetailRequest = z.infer<typeof threadDetailRequestSchema>;
export type ThreadDetailResponse = z.infer<typeof threadDetailResponseSchema>;

export const threadDetailRoute = createRoute({
  method: "post",
  path: "/thread/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadDetailResponseSchema,
        },
      },
      description: "Retrieve the thread detail",
    },
  },
});

// threadCreate
export const threadCreateRequestSchema = z.object({
  versionId: z.string().nullable(),
  shortName: z.string().optional(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
  parentThreadId: z.string().nullable(),
});

export const threadCreateResponseSchema = z.object({
  thread: threadDtoSchema,
});

export type ThreadCreateRequest = z.infer<typeof threadCreateRequestSchema>;
export type ThreadCreateResponse = z.infer<typeof threadCreateResponseSchema>;

export const threadCreateRoute = createRoute({
  method: "post",
  path: "/thread/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadCreateResponseSchema,
        },
      },
      description: "Create the thread",
    },
  },
});

// threadUpdate
export const threadUpdateRequestSchema = z.object({
  threadId: z.string(),
  activeVersion: z.boolean().optional(),
  shortName: z.string().optional(),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().optional(),
  messages: z.any().optional(),
  parentThreadId: z.string().nullable().optional(),
});

export const threadUpdateResponseSchema = z.object({});

export type ThreadUpdateRequest = z.infer<typeof threadUpdateRequestSchema>;
export type ThreadUpdateResponse = z.infer<typeof threadUpdateResponseSchema>;

export const threadUpdateRoute = createRoute({
  method: "post",
  path: "/thread/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadUpdateResponseSchema,
        },
      },
      description: "Update the thread",
    },
  },
});
