# Contentr

The purpose of this tool is to extract releveant dialogues from a text file based on a podcast, youtuve video or recorded stream in order to get fragments suitable for 60 seconds video clips.

## Requirements

- Node.js 18 or higher
- An Anthropic API key

## Installation
Install the necessary dependencies:

```bash
npm install
```

## Configuration

Copy the `.env.example` file to a new file named `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

You can get an API key from [Anthropic Console](https://console.anthropic.com/).

## Usage

1. *Create an Input File:*
   - Create a file named `input.txt` in the project root directory.
   - Add the text you want to process to this file.

2. *Run the Script:*
   - Execute the script using npm:

```bash
npm run start
```

3. *View the Results:*
   - The processed dialogues will be stored in the results folder, with each run generating a new folder named with a timestamp.

## Technical Details

This tool uses the [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) to interact with Claude Sonnet 4.5 for intelligent dialogue extraction. The SDK provides:

- Reliable API interactions
- Automatic token management
- Streaming response handling

## License

MIT License
