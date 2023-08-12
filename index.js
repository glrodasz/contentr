import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs/promises";
import { Configuration, OpenAIApi } from "openai";

const { OPENAI_API_KEY } = process.env;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const GTP_MODEL = "gpt-3.5-turbo-16k";
const MAX_TOKENS_PER_CHUNK = 8000;
const TRANSCRIPT_LANGUAGE = "spanish";
const TRANSCRIPT_WORDS_MIN_LENGTH = 200;
const TRANSCRIPT_WORDS_MAX_LENGTH = 400;
const VIDEO_CLIP_LENGTH = 60;
const VIDEO_TOPICS = [
  "tech",
  "javascript",
  "react",
  "soft skills",
  "node",
  "design systems",
  "css",
  "html",
  "career",
  "development",
  "programming",
  "inspiration",
];

function buildMessages(text) {
  return [
    {
      role: "system",
      content: `You are processing a transcript from a live streaming video in ${TRANSCRIPT_LANGUAGE}. Your task is to extract engaging and meaningful dialogues related to the topics: ${VIDEO_TOPICS.join(
        ", "
      )}
	  
      These dialogues should:
      - Fit a ${VIDEO_CLIP_LENGTH}-second video clip.
      - Be between ${TRANSCRIPT_WORDS_MIN_LENGTH} and ${TRANSCRIPT_WORDS_MAX_LENGTH} words long but ignore filler words, greetings, alerts, and other non-dialogue audio.
      - Be complete thoughts or standalone discussions, understandable without the context of the full video.

      Please do not modify the extracted dialogues keep them exactly as they were in the original transcript. If no relevant dialogues are found, return an empty array.

      The output should be in JSON format, with properties 'title' and 'dialogue' for each dialogue, both written in ${TRANSCRIPT_LANGUAGE}.
      
      The 'title' should be an engaging summary of the dialogue.
	`,
    },
    {
      role: "user",
      content: `Extract the meaningful dialogues from the following transcript:
	  \`\`\`
	  ${text}
	  \`\`\`
	  `,
    },
  ];
}

async function getDialogs() {
  try {
    const text = await fs.readFile("input.txt", "utf-8");

    let startIndex = 0;
    let endIndex = MAX_TOKENS_PER_CHUNK;
    let responseContent = [];

    while (startIndex < text.length) {
      console.log(
        `Processing chunk ${startIndex} to ${endIndex} of ${text.length}...`
      );
      const chunk = text.slice(startIndex, endIndex);

      const response = await openai.createChatCompletion({
        model: GTP_MODEL,
        messages: buildMessages(chunk),
        temperature: 0,
      });

      const content =
        response.data?.choices?.[0]?.message?.content?.trim() ?? "";

      // Parse the JSON content and push to responseContent array.
      responseContent.push(JSON.parse(content));

      // Move the startIndex and endIndex for the next chunk of text.
      startIndex += MAX_TOKENS_PER_CHUNK;
      endIndex += MAX_TOKENS_PER_CHUNK;
    }

    // Write the accumulated responses to a JSON file.
    await fs.writeFile("output.json", JSON.stringify(responseContent.flat()));
  } catch (error) {
    console.error(error, error.message);
  }
}

await getDialogs();
