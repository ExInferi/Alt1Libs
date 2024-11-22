import * as A1 from 'alt1/base';
import DialogReader, { DialogButton } from 'alt1/dialog';
import { foundPos, highlightRect, outputMessage } from './util';

/**
 * The DialogReader will be able to read the following information from dialog boxes:
 * title -> text in the top bar of the dialog
 * text -> the main text in the dialog
 * opts -> the text inside the option buttons
 *
 * It only reads a predefined color; in case of multiple colors present in the dialog text,
 * it will only read the black one.
 */

// Create a new dialog instance
const reader = new DialogReader();

// Boolean to check if we have a dialog position
foundPos.dialog = false;

// Create a type for the dialogReader return object
type Dialog = { text: string[]; opts: DialogButton[]; title: string };

/**
 * Starter function for the dialog reading
 *
 * The function performs the following steps:
 * 1. Checks if the Alt1 Toolkit is available and if the image reference is provided.
 *    - If not, it clears the output message and returns.
 * 2. If the dialog position is not found, it attempts to find it using the reader.
 *    - If the position is not found, it updates the output message (if a selector is provided) and returns.
 *    - If the position is found, it logs the position, updates the foundPos state, and highlights the area.
 * 3. Reads the dialog information from the current screen.
 *    - If the dialog is found, it updates the page with this information using the provided selector.
 * @param imgref - The screen capture reference from Alt1 Toolkit, or null if not available.
 * @param selector - An optional CSS selector to update the output message.
 */
function dialog(imgref: A1.ImgRef | null, selector?: string) {
	// Cancel if there's no Alt1 Toolkit or no image reference
	if (!window.alt1 || !imgref) {
		// Clear the output in case this was a call to stop reading
		if (selector) outputMessage('Press Start to begin reading', selector);
		reader.pos = null;
		return (foundPos.dialog = false);
	}

	if (!foundPos.dialog) {
		reader.find(imgref);
		if (reader.pos === null) {
			const message = 'Dialog position not found, trying to find...';
			if (selector) outputMessage(message, selector);
			return;
		} else {
			console.log('Dialog position found:', reader.pos);
			// Set the dialog as found so future calls will not try to find it again
			foundPos.dialog = true;
			// Destructure the coordinates and size from the  position
			const { x, y, width, height } = reader.pos;
			// Highlight the dialog information based on the found position)
			highlightRect(x, y, width, height);
		}
	}

	// Read the dialog information from the current screen
	const read: false | Dialog | null = reader.read(imgref);

	// Update the page with the read dialog information
	if (read) updatePage(read, selector);
}

function updatePage(dialog: Dialog, selector = 'body') {
	// Destructure the dialog object
	const { text, opts, title } = dialog;

	// Get the element to output the dialog
	const element = document.querySelector(selector);
	if (!element) throw new Error(`Selector '${selector}' not found`);
	// Clear the output before filling it with new dialog
	element.innerHTML = '';

	// Create elements for the returned dialog
	const titleEl = document.createElement('p');
	const textEl = document.createElement('p');
	const optsEl = document.createElement('ol');

	// Create labels for the dialog elements
	const titleLabel = document.createElement('span');
	const textLabel = document.createElement('span');
	const optionsLabel = document.createElement('span');
	textLabel.textContent = 'Text: ';
	titleLabel.textContent = 'Title: ';
	optionsLabel.textContent = 'Options: ';

	// Append the title
	titleEl.textContent = title;
	titleEl.prepend(titleLabel);
	element.appendChild(titleEl);

	// Append the text
	if (text && text.length) {
		textEl.textContent = text.join(' ');
	} else {
		textEl.textContent = 'No text found';
	}
	textEl.prepend(textLabel);
	element.appendChild(textEl);

	// Append the options
	if (!opts || opts.length === 0) {
		// Remove padding if no options are found
		optsEl.style.padding = '0';
		optsEl.textContent = 'No options found';
	} else {
		// Adjust padding and margin for options to make them more inline with the text & title
		optsEl.style.paddingLeft = '1em';
		optionsLabel.style.marginLeft = '-1em';
		// Create list items for each option
		opts.forEach((opt) => {
			const li = document.createElement('li');
			li.textContent = opt.text;
			optsEl.appendChild(li);
		});
	}
	optsEl.prepend(optionsLabel);
	element.appendChild(optsEl);
}

export default dialog;
