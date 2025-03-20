import { openai } from "@ai-sdk/openai";
import { experimental_createMCPClient as createMCPClient, Tool } from "ai";
import { streamText } from "ai";

let warehouseMcp: Awaited<ReturnType<typeof createMCPClient>> | null = null;

export async function POST(req: Request) {
  const { messages } = await req.json();

  warehouseMcp = await createMCPClient({
    transport: {
      type: "sse",
      url: "http://localhost:3002/api/mcp/warehouse",
    },
  });

  const warehouseTools = await warehouseMcp.tools();

  const tools: Record<string, Tool> = {
    ...warehouseTools,
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
