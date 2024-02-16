export const SENTENCE_END_THRESHOLD_PERCENTAGE = 75;

function findSentenceEndIndices(chunk) {
  const sentenceEndChars = [".", "?", "!"];
  return sentenceEndChars.map((char) => chunk.lastIndexOf(char));
}

function getNearestEndIndex(indices) {
  return Math.max(...indices, -1);
}

function isNoSentenceEnd(nearestEnd, chunk) {
  return nearestEnd === -1 || nearestEnd === chunk.length - 1;
}

function isBeyondThreshold(nearestEnd, threshold) {
  return nearestEnd > threshold;
}

export function resolveEndIndex(text, startIndex, maxChunkSize) {
  const endIndex = Math.min(startIndex + maxChunkSize, text.length);
  const chunk = text.slice(startIndex, endIndex);

  const sentenceEndIndices = findSentenceEndIndices(chunk);
  const nearestEnd = getNearestEndIndex(sentenceEndIndices);

  if (isNoSentenceEnd(nearestEnd, chunk)) {
    return endIndex;
  } else {
    const threshold = chunk.length * (SENTENCE_END_THRESHOLD_PERCENTAGE / 100);

    return isBeyondThreshold(nearestEnd, threshold)
      ? startIndex + nearestEnd + 1
      : endIndex;
  }
}
