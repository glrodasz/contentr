import { ChatOpenAI } from "npm:@langchain/openai";
import { z } from "npm:zod";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke);

const jokeResponse = await structuredLlm.invoke("Tell me random joke about the universe");

console.log(jokeResponse);