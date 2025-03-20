import { openai } from "@ai-sdk/openai";
import {
  experimental_createMCPClient as createMCPClient,
  tool,
  Tool,
} from "ai";
import { z } from "zod";
import { streamText } from "ai";

export const maxDuration = 30;

let warehouseMcp: any;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    warehouseMcp = await createMCPClient({
      transport: {
        type: "sse",
        url: "http://localhost:6333/meside/api/mcp-server/sse",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create MCP client");
  }

  const warehouseTools = await warehouseMcp.tools();

  const tools: Record<string, Tool> = {
    ...warehouseTools,
    // weather: tool({
    //   description: "Get the weather in a location",
    //   parameters: z.object({
    //     location: z.string().describe("The location to get the weather for"),
    //   }),
    //   execute: async ({ location }) => ({
    //     location,
    //     temperature: 72 + Math.floor(Math.random() * 21) - 10,
    //   }),
    // }),
  };

  const result = streamText({
    model: openai("gpt-4o"),
    system: [
      "# Instructions",
      "1. you excel at sql",
      "2. only generate query sql, not include modify table, column, etc.",
      "3. first get all warehouses, then get all tables, then get all columns in the specific table, then run query to validate the question, if the question is not valid, return the error message",
      "4. if validate is ok, must return the query sql in the response",
      "5. if the question is not valid, return the error message",
      "6. final response must be the markdown format",
      "# Question",
      "give me the album top 20 in chinook database",
    ].join("\n"),
    messages,
    tools,
    maxSteps: 10,
    experimental_telemetry: { isEnabled: true },
  });

  return result.toDataStreamResponse();
}
