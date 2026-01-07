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

## Multi-Agent Architecture

This tool uses a multi-agent system powered by the [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk):

### Agents

1. **Extractor Agent** (`agents/extractorAgent.js`)
   - Analyzes text chunks to identify relevant dialogues
   - Extracts complete, standalone discussions on target topics
   - Suggests titles for each dialogue

2. **Validator Agent** (`agents/validatorAgent.js`)
   - Reviews extracted dialogues for quality compliance
   - Validates word count (400-600 words)
   - Ensures content integrity matches original text
   - Approves or rejects dialogues with detailed reasoning

3. **Orchestrator** (`agents/orchestrator.js`)
   - Coordinates the multi-agent workflow
   - Passes chunks to Extractor Agent
   - Sends results to Validator Agent for review
   - Filters and returns only approved dialogues

### Processing Flow

```
Input Text
    ↓
Chunk Calculator (token-aware splitting)
    ↓
┌─────────────────────────────────────┐
│  Extractor Agent                    │
│  - Identifies relevant dialogues    │
│  - Extracts complete discussions    │
│  - Suggests titles                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Validator Agent                    │
│  - Reviews extracted content        │
│  - Validates against criteria       │
│  - Approves or rejects dialogues    │
└─────────────────────────────────────┘
    ↓
Results Aggregator (approved dialogues only)
    ↓
Output JSON File
```

## License

MIT License
