import { query } from "@anthropic-ai/claude-agent-sdk";
import { CLAUDE_MODEL, TOPICS } from "../config.js";

const VALIDATOR_SYSTEM_PROMPT = `You are a Dialogue Validator Agent. Your role is to review and validate extracted dialogues for quality and compliance.

You will receive:
1. The original text chunk
2. Extracted dialogues in JSON format

Your task is to validate each dialogue against these criteria:
- The dialogue must be between 400-600 words
- The dialogue must be on relevant topics: ${TOPICS}
- The dialogue must be a complete, standalone thought that makes sense without additional context
- The dialogue must be EXACTLY as it appears in the original text (no modifications, summaries, or alterations)
- The title must accurately summarize the dialogue content

For each dialogue, provide a validation result:
- "approved": The dialogue meets all criteria
- "rejected": The dialogue fails one or more criteria (specify which)

Output format (plain text JSON array, NO markdown):
[
  {
    "title": "original title",
    "dialogue": "original dialogue",
    "status": "approved" or "rejected",
    "reason": "explanation if rejected, or 'Meets all criteria' if approved",
    "wordCount": <actual word count>
  }
]

Be strict but fair. Only reject dialogues that clearly violate the criteria.
NEVER use markdown for the output response, just plain text.`;

export async function validateDialogues(originalChunk, extractedDialogues) {
  const userPrompt = `Please validate the following extracted dialogues:

ORIGINAL TEXT CHUNK:
"${originalChunk}"

EXTRACTED DIALOGUES:
${extractedDialogues}

Validate each dialogue and return the results.`;

  try {
    let assistantResponse = "";

    for await (const message of query({
      prompt: userPrompt,
      options: {
        model: CLAUDE_MODEL,
        systemPrompt: VALIDATOR_SYSTEM_PROMPT,
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
    console.error("Validator Agent Error:", error.message);
    throw error;
  }
}
