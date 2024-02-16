import fs from "node:fs/promises";

export async function createFolder(folderName) {
  try {
    await fs.mkdir(folderName, { recursive: true });
  } catch (error) {
    console.error("Error creating folder:", error.message);
    throw error;
  }
}

export async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
  } catch (error) {
    console.error("Error copying file:", error.message);
    throw error;
  }
}

export async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading file:", error.message);
    throw error;
  }
}

export async function writeOutputFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing output file:", error.message);
    throw error;
  }
}
