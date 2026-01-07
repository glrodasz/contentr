import { extractDialogues } from "./extractorAgent.js";
import { validateDialogues } from "./validatorAgent.js";

function cleanMarkdown(response) {
  if (response.includes("```json")) {
    const jsonPattern = /```json([\s\S]*?)```/;
    const match = response.match(jsonPattern);
    if (match) {
      return match[1].trim();
    }
  }
  if (response.includes("```")) {
    const codePattern = /```([\s\S]*?)```/;
    const match = response.match(codePattern);
    if (match) {
      return match[1].trim();
    }
  }
  return response;
}

function parseJSON(response) {
  try {
    return JSON.parse(cleanMarkdown(response));
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return [];
  }
}

export async function processChunkWithAgents(chunk) {
  console.log("\n  🔍 Extractor Agent: Analyzing chunk...");

  // Step 1: Extract dialogues using the Extractor Agent
  const extractedResponse = await extractDialogues(chunk);
  const extractedDialogues = parseJSON(extractedResponse);

  if (!extractedDialogues || extractedDialogues.length === 0) {
    console.log("  ℹ️  No dialogues extracted from this chunk");
    return [];
  }

  console.log(`  ✅ Extractor Agent: Found ${extractedDialogues.length} potential dialogue(s)`);
  console.log("  🔎 Validator Agent: Reviewing extracted dialogues...");

  // Step 2: Validate dialogues using the Validator Agent
  const validationResponse = await validateDialogues(chunk, extractedResponse);
  const validatedDialogues = parseJSON(validationResponse);

  if (!validatedDialogues || validatedDialogues.length === 0) {
    console.log("  ⚠️  Validator Agent: Could not validate dialogues");
    return extractedDialogues; // Fall back to extracted dialogues
  }

  // Step 3: Filter approved dialogues
  const approvedDialogues = validatedDialogues.filter(
    (d) => d.status === "approved"
  );
  const rejectedCount = validatedDialogues.length - approvedDialogues.length;

  console.log(`  ✅ Validator Agent: ${approvedDialogues.length} approved, ${rejectedCount} rejected`);

  // Log rejection reasons
  validatedDialogues
    .filter((d) => d.status === "rejected")
    .forEach((d) => {
      console.log(`     ❌ Rejected "${d.title}": ${d.reason}`);
    });

  // Return only approved dialogues with clean structure
  return approvedDialogues.map((d) => ({
    title: d.title,
    dialogue: d.dialogue,
    validationStatus: d.status,
    validationReason: d.reason,
  }));
}
