import dotenv from "dotenv";
dotenv.config();

import { Configuration, OpenAIApi } from "openai";
import { GTP_MODEL } from "./config.js";

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export async function fetchChatCompletion(chunk, promptBuilder) {
  const messages = promptBuilder(chunk).map((message) => ({
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
