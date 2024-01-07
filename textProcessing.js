import { RESPONSE_TOKEN_PERCENTAGE_ALLOCATION } from "./config.js";
import { fetchChatCompletion } from "./apiCalls.js";

export function estimateTokenCount(text) {
  const averageWordLength = 5;
  return Math.ceil(text.length / averageWordLength);
}

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

function cleanMarkdown(response) {
  // Check if "```json" is present in the response
  if (response.includes("```json")) {
    // Use regular expressions to extract JSON content
    const jsonPattern = /```json([\s\S]*?)```/;
    const match = response.match(jsonPattern);

    // If a match is found, extract the JSON content
    if (match) {
      const jsonContent = match[1].trim();
      return jsonContent;
    }
  }

  // If "```json" is not present, return the original response
  return response;
}

export async function processChunk(text, startIndex, endIndex) {
  const chunk = text.slice(startIndex, endIndex);
  const content = await fetchChatCompletion(chunk);

  let parsedContent;
  try {
    parsedContent = JSON.parse(cleanMarkdown(content));
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    throw error;
  }

  return parsedContent;
}

export function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function processDialogues(dialogueArray) {
  dialogueArray.forEach((dialogueObj) => {
    if (dialogueObj.dialogue) {
      // Count characters
      const charCount = dialogueObj.dialogue.length;

      // Count words
      const wordCount = countWords(dialogueObj.dialogue);

      // Add these counts to the object
      dialogueObj.chars = charCount;
      dialogueObj.words = wordCount;
    }
  });

  return dialogueArray;
}
