export function buildTopics(topics) {
  const topicsLength = topics.length;

  if (topicsLength === 1) {
    return topics[0];
  }

  if (topicsLength === 2) {
    return `${topics[0]} and ${topics[1]}`;
  }

  return `${topics.slice(0, -1).join(", ")}, and ${topics[topicsLength - 1]}`;
}
