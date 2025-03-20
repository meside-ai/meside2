import { Hono } from "hono";
import { healthApi } from "./api/health";
import { threadApi } from "./api/thread";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.route("/api", healthApi);
app.route("/api", threadApi);

app.onError(createErrorHandler());

export default {
  ...app,
  port: 3003,
};
