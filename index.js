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
const TRANSCRIPT_WORDS_LENGTH = 200;
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
];

function buildMessages(text) {
  return [
    {
      role: "system",
      content: `Given a transcript in ${TRANSCRIPT_LANGUAGE} from a video, identify and extract the most interesting and meaningful dialogues that would fit a ${VIDEO_CLIP_LENGTH} seconds video clip.
	  
	  Each dialogue should be concise, engaging, and at most ${TRANSCRIPT_WORDS_LENGTH} words in length.
	  
	  Please provide the extracted dialogues exactly as they were from the original transcript and suggest a possible title for each extracted dialogue.

	  Don't modify the original transcript in any way, only extract the dialogues that would fit a ${VIDEO_CLIP_LENGTH} seconds video clip.
	  
	  Ensure the dialogues are complete thoughts or discussions that can stand alone for viewers who haven't seen the original video.
	  
	  The topics that we are looking for is anything related to: ${VIDEO_TOPICS.join(
      ", "
    )}.	

	Since this transcript is form a live streaming video, exclude any greetings, alerts, or other non-dialogue audio as consideration from the possible dialogues.

	It's completly fine if you don't find any relevant dialogues in the transcript, in that case return an empty array.

	The title and dialogue should be written in ${TRANSCRIPT_LANGUAGE}.

	Please keep the output format as JSON, with the property 'title' and 'dialogue'.
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
