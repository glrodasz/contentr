export const RESPONSE_TOKEN_PERCENTAGE_ALLOCATION = 40;
export const SAFETY_MARGIN = 200;

export function calculateMaxChunkSize(promptTokenCount, modelTokenLimit) {
  const responseTokenEstimate =
    modelTokenLimit * (RESPONSE_TOKEN_PERCENTAGE_ALLOCATION / 100);
  return (
    modelTokenLimit - promptTokenCount - responseTokenEstimate - SAFETY_MARGIN
  );
}
