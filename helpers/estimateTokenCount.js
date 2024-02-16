const AVERAGE_WORD_LENGTH = 5;

export function estimateTokenCount(text) {
  return Math.ceil(text.length / AVERAGE_WORD_LENGTH);
}
