import { buildTopics } from "./buildTopics.js";

// Model configuration
export const MODEL_TOKEN_LIMIT = 16385;
export const SAFETY_MARGIN = 200;
export const GTP_MODEL = "gpt-3.5-turbo-1106";

// Text processing
export const SENTENCE_END_THRESHOLD_PERCENTAGE = 80;
export const TOPICS = buildTopics([
  "tech",
  "javascript",
  "react",
  "soft skills",
  "node",
  "design systems",
  "css",
  "html",
  "career",
  "sotrybook",
  "testing",
  "security",
  "ideas",
  "development",
  "programming",
  "inspiration"
]);
