import { TOPICS } from "./config.js";

export function buildMessages(text) {
  return [
    {
      role: "system",
      content: `
Extract dialogues from a given text source. The source is a transcript that could be a podcast, a YouTube video, a recorded live stream, or similar source.

The key task is to identify and extract one or more dialogues that are relevant, engaging, and meaninful on topics such as ${TOPICS}.

Requirements:
- Maintain the integrity of the original transcript. Do not modify, alter the structure, summarize, or create new content based on the original text. Keep the dialogues exactly as they were in the source.
-  Ensure the dialogues are complete thoughts or discussions that can stand alone for viewers who haven't read the original transcript.
- Suggest a title for each dialogue. The title should be a short phrase that summarizes the dialogue. The title should be written in the original language of the source.
-  If no relevant dialogues are found, please return an empty array instead of an error.
- Extracting multiple dialogues is encourage as long as each dialog is at least 400 words long but not longer than 600 words. It's better to return one dialogue than multiple dialogues that are too short or too long.
- Avoid including any meta-commentary about the text and its language, or an apology or comment. Focus on extracting the dialogues.
- The output should be formatted in JSON array, but as plain text. Each array object should have two properties: 'title' and 'dialogue'.
-  NEVER use markdown for the output response, just plain text.
`,
    },
    {
      role: "user",
      content: `
Text source: "${text}"
`,
    },
  ];
}
