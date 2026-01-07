import { query } from "@anthropic-ai/claude-agent-sdk";
import { CLAUDE_MODEL, TOPICS } from "../config.js";

const EXTRACTOR_SYSTEM_PROMPT = `You are a Dialogue Extractor Agent. Your role is to extract dialogues from text transcripts.

The source is a transcript that could be a podcast, a YouTube video, a recorded live stream, or similar source.

Your task is to identify and extract one or more dialogues that are relevant, engaging, and meaningful on topics such as ${TOPICS}.

Requirements:
- Maintain the integrity of the original transcript. Do not modify, alter the structure, summarize, or create new content based on the original text. Keep the dialogues exactly as they were in the source.
- Ensure the dialogues are complete thoughts or discussions that can stand alone for viewers who haven't read the original transcript.
- Suggest a title for each dialogue. The title should be a short phrase that summarizes the dialogue. The title should be written in the original language of the source.
- If no relevant dialogues are found, please return an empty array instead of an error.
- Extracting multiple dialogues is encouraged as long as each dialog is at least 400 words long but not longer than 600 words. It's better to return one dialogue than multiple dialogues that are too short or too long.
- Avoid including any meta-commentary about the text and its language, or an apology or comment. Focus on extracting the dialogues.
- The output should be formatted in JSON array, but as plain text. Each array object should have two properties: 'title' and 'dialogue'.
- NEVER use markdown for the output response, just plain text.`;

export async function extractDialogues(chunk) {
  const userPrompt = `Extract relevant dialogues from the following text source:

"${chunk}"`;

  try {
    let assistantResponse = "";

    for await (const message of query({
      prompt: userPrompt,
      options: {
        model: CLAUDE_MODEL,
        systemPrompt: EXTRACTOR_SYSTEM_PROMPT,
        maxTurns: 1,
        allowedTools: [],
      },
    })) {
      if (message.type === "assistant") {
        if (Array.isArray(message.message?.content)) {
          for (const block of message.message.content) {
            if (block.type === "text") {
              assistantResponse += block.text;
            }
          }
        }
      }
    }

    return assistantResponse.trim();
  } catch (error) {
    console.error("Extractor Agent Error:", error.message);
    throw error;
  }
}
