export function cleanJsonMarkdown(response) {
  // Check if "```json" is present in the response
  if (response.includes("```json")) {
    // Use regular expressions to extract JSON content
    const jsonPattern = /```json([\s\S]*?)```/;
    const match = response.match(jsonPattern);

    // If a match is found, extract the JSON content
    if (match) {
      const jsonContent = match[1].trim();
      return jsonContent;
    }
  }

  // If "```json" is not present, return the original response
  return response;
}
