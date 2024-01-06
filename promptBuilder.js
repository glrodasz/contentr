import { buildTopics } from "./buildTopics.js";

const DIALOGUE_TOPICS = [
  "technology",
  "programming",
  "design",
  "personal development",
];

export function buildMessages(text) {
  return [
    {
      role: "system",
      content: `Extract meaningful and engaging dialogues from a given text source. This source could be a podcast, YouTube video, recorded streaming, or any similar format. The key task is to identify and extract dialogues that are relevant and interesting.
            
            Guidelines for extraction:
            - The dialogues should be engaging and meaningful, relevant to topics such as ${buildTopics(
              DIALOGUE_TOPICS
            )}.
            - Ensure that the dialogues are suitable for a 60-second video clip.
            - Each dialogue should be between 200 and 400 words, excluding filler words, greetings, alerts, and other non-dialogue audio.
            - Maintain the integrity of the original dialogues. Do not modify, alter the structure, summarize, or create new content based on the original text. Keep the dialogues exactly as they were in the source.
            - If no relevant dialogues are found, return an empty array.
            - The output should be formatted in JSON, with each dialogue entry containing 'title' and 'dialogue', both in the original language of the source.`,
    },
    {
      role: "user",
      content: `Please extract the meaningful dialogues from the following text:
            \`\`\`
            ${text}
            \`\`\``,
    },
  ];
}
