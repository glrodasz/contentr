import { TOPICS } from "./config.js";


export function buildMessages(text) {
  return [
    {
      role: "system",
      content: `Extract meaningful and engaging dialogues from a given text source. The source could be from a podcast, a YouTube video, or a recorded stream.

      The key task is to identify and extract dialogues that are relevant, engaging, and meaninful on topics such as ${TOPICS}.

      Requirements:
      - Each extracted dialogue should be at least 200 words but not more than 400 words, excluding filler words, greetings, alerts, and other non-dialogue audio.
      - Ensure that the dialogues are suitable for a 60-second video clip.
      - Maintain the integrity of the original dialogues. Do not modify, alter the structure, summarize, or create new content based on the original text. Keep the dialogues exactly as they were in the source.
      -  Ensure the dialogues are complete thoughts or discussions that can stand alone for viewers who haven't seen the original video.      
      - The output should be formatted in JSON array, but as plain text.Each object should have two properties: 'title' and 'dialogue', both in the original language of the source.
      -  If no relevant dialogues are found, please return an empty array, avoid return an apology or comment.
      - Avoid including any meta-commentary about the text or its language. directly focus on extracting the dialogues.
      - Don't use markdown for the output response, just plain text.`,
    },
    {
      role: "user",
      content: `Text source: "${text}"`,
    },
  ];
}
