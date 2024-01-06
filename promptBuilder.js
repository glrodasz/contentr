import { buildTopics } from "./buildTopics.js";

const TOPICS = [
  "technology",
  "programming",
  "javascript",
  "react",
  "design",
  "soft skills",
  "personal development",
];

export function buildMessages(text) {
  return [
    {
      role: "system",
      content: `Extract meaningful and engaging dialogues from a given text source. The source could be from a podcast, a YouTube video, or a recorded stream.

      The key task is to identify and extract a dialogue that is relevant, engaging, meaninful and relevant on topics such as ${buildTopics(
        TOPICS
      )}.

      Requirements:
      - Each extracted dialogue should be at least 200 words but not more than 400 words, excluding filler words, greetings, alerts, and other non-dialogue audio.
      - Ensure that the dialogues are suitable for a 90-second video clip.
      - Maintain the integrity of the original dialogues. Do not modify, alter the structure, summarize, or create new content based on the original text. Keep the dialogues exactly as they were in the source.
      - The output should be formatted in JSON as an array of objects. Each object should have two properties: 'title' and 'dialogue', both in the original language of the source.
      -  If no relevant dialogues are found, or the dialogue is less than 200 words or more than 400 words please return an empty array, avoid return an apology or comment.
      - Avoid including any meta-commentary about the text or its language. directly focus on extracting the dialogues.
      - Don't use markdown for the output, just plain text.`,
    },
    {
      role: "user",
      content: `Text source: "${text}"`,
    },
  ];
}
