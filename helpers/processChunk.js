import { cleanJsonMarkdown } from "../helpers/cleanJsonMarkdown.js";
import { fetchChatCompletion } from "../clients/openAI/index.js";

export async function processChunk(text, promptBuilder, startIndex, endIndex) {
  const chunk = text.slice(startIndex, endIndex);
  const content = await fetchChatCompletion(chunk, promptBuilder);

  console.log(content);

  let parsedContent;
  try {
    parsedContent = JSON.parse(cleanJsonMarkdown(content));
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    throw error;
  }

  return parsedContent;
}
