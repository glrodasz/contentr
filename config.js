import { buildTopics } from "./buildTopics.js";

// Claude model configuration
// Claude Sonnet 4.5 has a 200k token context window
export const MODEL_TOKEN_LIMIT = 32000; // Conservative limit for reliable processing
export const SAFETY_MARGIN = 500;
export const RESPONSE_TOKEN_PERCENTAGE_ALLOCATION = 40;
export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";

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
