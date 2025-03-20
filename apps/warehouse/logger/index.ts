import { environment } from "@/configs/environment";
import { type Logger, pino } from "pino";

export const getLogger = (name: string): Logger => {
  const loggerType = "server";

  if (environment.NODE_ENV === "production") {
    return pino({
      name: `${loggerType}:${name}`,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          colorizeObjects: true,
          errorLikeObjectKeys: [
            "err",
            "error",
            "error_stack",
            "stack",
            "apiErrorHandlerCallStack",
          ],
        },
      },
    });
  }

  return pino({
    name: `${loggerType}:${name}`,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        colorizeObjects: true,
        errorLikeObjectKeys: [
          "err",
          "error",
          "error_stack",
          "stack",
          "apiErrorHandlerCallStack",
        ],
        ignore: "pid,hostname",
      },
    },
  });
};
