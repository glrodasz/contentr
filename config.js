import { buildTopics } from "./buildTopics.js";

// Model configuration
export const MODEL_TOKEN_LIMIT = 16385;
export const SAFETY_MARGIN = 200;
export const RESPONSE_TOKEN_PERCENTAGE_ALLOCATION = 40;
export const GTP_MODEL = "gpt-3.5-turbo-1106";

// Text processing
export const SENTENCE_END_THRESHOLD_PERCENTAGE = 75;
export const TOPICS = buildTopics([
  "technology",
  "development",
  "programming",
  "design",
  "javascript",
  "react",
  "soft skills",
  "node",
  "design systems",
  "css",
  "html",
  "career development",
  "storybook",
  "testing",
  "security",
  "ideas",
  "inspiration",
  "motivation"
]);
