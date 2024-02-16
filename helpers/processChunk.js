import { cleanJsonMarkdown } from "../modules/dialogsExtractor";
import { fetchChatCompletion } from "../clients/openAI";


export async function processChunk(text, promptBuilder, startIndex, endIndex) {
	const chunk = text.slice(startIndex, endIndex);
	const content = await fetchChatCompletion(chunk, promptBuilder);

	let parsedContent;
	try {
		parsedContent = JSON.parse(cleanJsonMarkdown(content));
	} catch (error) {
		console.error("Error parsing JSON:", error.message);
		throw error;
	}

	return parsedContent;
}
