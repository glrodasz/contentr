import { countWords } from "../../utils";


export function processDialogues(dialogueArray) {
	dialogueArray.forEach((dialogueObj) => {
		if (dialogueObj.dialogue) {
			// Count characters
			const charCount = dialogueObj.dialogue.length;

			// Count words
			const wordCount = countWords(dialogueObj.dialogue);

			// Add these counts to the object
			dialogueObj.chars = charCount;
			dialogueObj.words = wordCount;
		}
	});

	return dialogueArray;
}
