# Contentr

The purpose of this tool is to extract releveant dialogues from a text file based on a podcast, youtuve video or recorded stream in order to get fragments suitable for 60 seconds video clips.

## Requirements

- Node.js (mention the minimum version if applicable)
- An OpenAI API key

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

Edit the `.env` file and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

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

## License

MIT License