import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { GTP_MODEL } from "./config.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchChatCompletion(chunk, promptBuilder) {
  const messages = promptBuilder(chunk).map((message) => ({
    ...message,
    content: message.content.trim(),
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: GTP_MODEL,
      messages,
      temperature: 0,
    });

    return completion.choices?.[0].message.content.trim() ?? "";
  } catch (error) {
    console.error("Error during API call:", error.message);
    throw error;
  }
}
