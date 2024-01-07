import dotenv from "dotenv";

import { Configuration, OpenAIApi } from "openai";

import { buildMessages } from "./promptBuilder.js";
import { GTP_MODEL } from "./config.js";

dotenv.config();

const { OPENAI_API_KEY } = process.env;
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export async function fetchChatCompletion(chunk) {
  const messages = buildMessages(chunk).map((message) => ({
    ...message,
    content: message.content.trim(),
  }));

  try {
    const response = await openai.createChatCompletion({
      model: GTP_MODEL,
      messages,
      temperature: 0,
    });
    return response.data?.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    console.error("Error during API call:", error.message);
    throw error;
  }
}
