export function displayProgressBar(current, total) {
  const barLength = 30;
  const progress = Math.round((current / total) * barLength);
  const progressBar = `[${"=".repeat(progress)}${" ".repeat(
    barLength - progress
  )}]`;
  const percentage = ((current / total) * 100).toFixed(2);

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Processing: ${progressBar} ${percentage}%\n`);
}
