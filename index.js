import {
  createFolder,
  copyFile,
  readFileContent,
  writeOutputFile,
} from "./fileOperations.js";

import { displayProgressBar } from "./progressBar.js";

import {
  estimateTokenCount,
  calculateMaxChunkSize,
  processDialogues,
  countWords,
} from "./textProcessing.js";
import { resolveEndIndex } from "./resolveEndIndex.js";
import { buildMessages } from "./promptBuilder.js";
import { processChunkWithAgents } from "./agents/orchestrator.js";

import { printSummary } from "./summary.js";

import { MODEL_TOKEN_LIMIT, SAFETY_MARGIN } from "./config.js";

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function getDialogs(inputFilePath) {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const resultFolderPath = `results/${timestamp}`;
  const inputFileCopyPath = `${resultFolderPath}/input.txt`;
  const outputFilePath = `${resultFolderPath}/output.json`;

  console.log("\n🚀 Starting Multi-Agent Dialogue Extraction");
  console.log("━".repeat(50));

  try {
    await createFolder(resultFolderPath);
    await copyFile(inputFilePath, inputFileCopyPath);

    const text = await readFileContent(inputFilePath);
    let startIndex = 0;
    let endIndex;
    let responseContent = [];
    const titles = [];
    let chunkNumber = 0;

    console.log(`📄 Processing input file: ${inputFilePath}`);
    console.log(`📊 Total characters: ${text.length}\n`);

    while (startIndex < text.length) {
      chunkNumber++;
      const systemMessage = buildMessages("")[0];
      const systemMessageTokenCount = estimateTokenCount(systemMessage.content);

      const maxChunkSize = calculateMaxChunkSize(
        systemMessageTokenCount,
        MODEL_TOKEN_LIMIT,
        SAFETY_MARGIN
      );

      endIndex = resolveEndIndex(text, startIndex, maxChunkSize);

      console.log(`\n📦 Processing Chunk ${chunkNumber}`);
      displayProgressBar(endIndex, text.length);

      try {
        const chunk = text.slice(startIndex, endIndex);

        // Use multi-agent processing
        const chunkContent = await processChunkWithAgents(chunk);
        responseContent.push(chunkContent);

        titles.push(
          ...chunkContent.map(
            (item) => `${item.title} (${countWords(item.dialogue)} words)`
          )
        );
      } catch (processError) {
        console.error("  ❌ Error processing chunk:", processError.message);
      }

      startIndex = endIndex;
    }

    responseContent = responseContent.flat();
    responseContent = processDialogues(responseContent);

    await writeOutputFile(outputFilePath, responseContent);

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n" + "━".repeat(50));
    console.log("✅ Multi-Agent Processing Complete\n");

    printSummary(timestamp, titles, totalTime, text.length);
  } catch (error) {
    console.error("❌ General error:", error.message);
  }
}

getDialogs("./input.txt");
