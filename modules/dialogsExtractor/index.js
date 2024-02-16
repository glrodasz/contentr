import {
  fileOperations,
  countWords,
  displayProgressBar,
  getTimestamp,
} from "../../utils";

import {
  resolveEndIndex,
  estimateTokenCount,
  calculateMaxChunkSize,
  processChunk
} from "../../helpers";

import { MODEL_TOKEN_LIMIT } from "../../clients/openAI/config.js";

import { extractDialogsPrompt } from "./prompt.js";
import { processDialogues } from "./processDialogues.js";
import { printSummary } from "./printSummary.js";

const { createFolder, copyFile, readFileContent, writeOutputFile } =
  fileOperations;

function getSystemMessage() {
  return extractDialogsPrompt("")[0].content;
}

export async function extractDialogs(inputFilePath) {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const resultFolderPath = `results/${timestamp}`;
  const inputFileCopyPath = `${resultFolderPath}/input.txt`;
  const outputFilePath = `${resultFolderPath}/output.json`;

  try {
    await createFolder(resultFolderPath);
    await copyFile(inputFilePath, inputFileCopyPath);

    const text = await readFileContent(inputFilePath);
    let startIndex = 0;
    let endIndex;
    let responseContent = [];
    let titles = [];

    while (startIndex < text.length) {
      const systemMessageTokenCount = estimateTokenCount(getSystemMessage());

      const maxChunkSize = calculateMaxChunkSize(
        systemMessageTokenCount,
        MODEL_TOKEN_LIMIT
      );

      endIndex = resolveEndIndex(text, startIndex, maxChunkSize);
      displayProgressBar(endIndex, text.length);

      try {
        const chunkContent = await processChunk(text, extractDialogsPrompt, startIndex, endIndex, );
        responseContent.push(chunkContent);

        titles.push(
          ...chunkContent.map(
            (item) => `${item.title} (${countWords(item.dialogue)} words)`
          )
        );
      } catch (processError) {
        console.error("Error processing chunk:", processError.message);
      }

      startIndex = endIndex;
    }

    responseContent = responseContent.flat();
    responseContent = processDialogues(responseContent);

    await writeOutputFile(outputFilePath, responseContent);

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    printSummary(timestamp, titles, totalTime, text.length);
  } catch (error) {
    console.error("General error:", error.message);
  }
}
