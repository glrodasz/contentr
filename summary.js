export function printSummary(timestamp, titles, totalTime, textLength) {
  console.log(`\nProcessing Summary:`);
  console.log(`- Folder ID (Timestamp): ${timestamp}`);
  console.log(`- Total Results: ${titles.length}`);
  console.log(`- Titles:`);
  titles.forEach((title, index) => console.log(`  ${index + 1}. ${title}`));
  console.log(`- Total Processing Time: ${totalTime} seconds`);
  console.log(`- Length of Input Text: ${textLength} characters`);
}
