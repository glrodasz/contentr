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

const RESPONSE_TOKEN_PERCENTAGE_ALLOCATION = 30;

export function calculateMaxChunkSize(
  promptTokenCount,
  MODEL_TOKEN_LIMIT,
  SAFETY_MARGIN
) {
  const responseTokenEstimate =
    MODEL_TOKEN_LIMIT * (RESPONSE_TOKEN_PERCENTAGE_ALLOCATION / 100);
  return (
    MODEL_TOKEN_LIMIT - promptTokenCount - responseTokenEstimate - SAFETY_MARGIN
  );
}

export async function processChunk(text, startIndex, endIndex) {
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

export function processDialogues(dialogueArray) {
  dialogueArray.forEach((dialogueObj) => {
    if (dialogueObj.dialogue) {
      // Count characters
      const charCount = dialogueObj.dialogue.length;

      // Count words
      const wordCount = dialogueObj.dialogue
        .split(/\s+/)
        .filter(Boolean).length;

      // Add these counts to the object
      dialogueObj.chars = charCount;
      dialogueObj.words = wordCount;
    }
  });

  return dialogueArray;
}
