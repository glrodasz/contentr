import dotenv from "dotenv";
import { query } from "@anthropic-ai/claude-agent-sdk";

import { buildSystemPrompt, buildUserPrompt } from "./promptBuilder.js";
import { CLAUDE_MODEL } from "./config.js";

dotenv.config();

export async function fetchChatCompletion(chunk) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(chunk);

  try {
    let assistantResponse = "";

    // Use the Claude Agent SDK query function
    for await (const message of query({
      prompt: userPrompt,
      options: {
        model: CLAUDE_MODEL,
        systemPrompt: systemPrompt,
        maxTurns: 1,
        allowedTools: [], // No tools needed, just text completion
      },
    })) {
      // Collect the assistant's response
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
    console.error("Error during Claude API call:", error.message);
    throw error;
  }
}
