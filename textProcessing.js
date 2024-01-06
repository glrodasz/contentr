import { fetchChatCompletion } from "./apiCalls.js";

export function findNearestSentenceEnd(text, startIndex, maxChunkSize) {
  const endIndex = Math.min(startIndex + maxChunkSize, text.length);
  const chunk = text.slice(startIndex, endIndex);

  const lastPeriod = chunk.lastIndexOf(".");
  const lastQuestion = chunk.lastIndexOf("?");
  const lastExclamation = chunk.lastIndexOf("!");

  const nearestEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  return nearestEnd === -1 || nearestEnd === chunk.length - 1
    ? endIndex
    : startIndex + nearestEnd + 1;
}

export function estimateTokenCount(text) {
  const averageWordLength = 5;
  return Math.ceil(text.length / averageWordLength);
}

export function calculateMaxChunkSize(
  buildMessageTokens,
  MODEL_TOKEN_LIMIT,
  SAFETY_MARGIN
) {
  return MODEL_TOKEN_LIMIT - buildMessageTokens - SAFETY_MARGIN;
}

export async function processChunk(
  text,
  startIndex,
  endIndex
) {
  const chunk = text.slice(startIndex, endIndex);
  const content = await fetchChatCompletion(chunk);

  let parsedContent;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    throw error;
  }

  return parsedContent;
}
