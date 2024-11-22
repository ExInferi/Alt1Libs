import * as A1 from 'alt1/base';

/**
 * Interface for the found positions.
 *
 * @interface FoundPos
 * @property {boolean} animal - Indicates if the animal info position is found.
 * @property {boolean} bosstimer - Indicates if the boss timer position is found.
 * @property {boolean} buffs - Indicates if the buff bar position is found.
 * @property {boolean} chatbox - Indicates if the chatbox position is found.
 * @property {boolean} dialog - Indicates if the dialog position is found.
 * @property {boolean} dropsmenu - Indicates if the drops menu position is found.
 * @property {boolean} targetmob - Indicates if the target info position is found.
 */
interface FoundPos {
	animal: boolean;
	bosstimer: boolean;
	buffs: boolean;
	chatbox: boolean;
	dialog: boolean;
	dropsmenu: boolean;
	targetmob: boolean;
}

/**
 * Object representing the found positions.
 *
 * @type {FoundPos}
 */
const foundPos: FoundPos = {
	animal: false,
	bosstimer: false,
	buffs: false,
	chatbox: false,
	dialog: false,
	dropsmenu: false,
	targetmob: false,
};

/**
 * Highlight a rectangle on the screen.
 * @param x The x-coordinate of the rectangle.
 * @param y The y-coordinate of the rectangle.
 * @param width The width of the rectangle.
 * @param height The height of the rectangle.
 */
function highlightRect(x: number, y: number, width: number, height: number) {
	// The overlay functions exist within the global alt1 namespace
	alt1.overLayRect(
		// The color of the overlay, in this case golden yellow
		A1.mixColor(255, 211, 63),
		// The position and dimensions of the chatbox
		x,
		y,
		width,
		height,
		// How long the overlay needs to be displayed in ms
		2000,
		// The width of the overlay in pixels
		3,
	);
}

/**
 * Outputs a message to a specified HTML element.
 *
 * @param message - The message to be displayed.
 * @param selector - The CSS selector of the HTML element where the message will be displayed.
 * @throws Will throw an error if the element with the specified selector is not found.
 */
function outputMessage(message: string, selector: string) {
	const output = document.querySelector(selector);
	if (!output) throw new Error(`Selector '${selector}' not found`);
	output.textContent = message;
}

/**
 * Returns a checkmark symbol based on the boolean input.
 *
 * @param c - A boolean value.
 * @returns A string containing '✔' if the input is true, otherwise '✘'.
 */
function checkmark(c: boolean) {
	return c ? '✔' : '✘';
}

/**
 * Formats milliseconds into a relative time string.
 *
 * @param time - The time in milliseconds to format.
 * @returns A string representing the time difference in a human-readable format, such as "2d 3h 4m 5s ago".
 *          If the time difference is less than one second, it returns "just now". If the time is invalid or
 *          the difference is less than or equal to one millisecond, it returns "Unknown".
 */
function timeDiff(time: number) {
	let ms = time;
	// Handle tick edge case
	const EPOCH = 62135596800000;
	if (time > EPOCH) ms = Date.now() - (time - EPOCH);
	if (ms <= 1) return 'Unknown';

	// Time units in milliseconds
	const SEC = 1000;
	const MIN = SEC * 60;
	const HOUR = MIN * 60;
	const DAY = HOUR * 24;

	// Handle zero seconds case
	if (ms < SEC) return 'just now';

	// Calculate each time unit with remainders
	const days = Math.floor(ms / DAY);
	const hours = Math.floor((ms % DAY) / HOUR);
	const minutes = Math.floor((ms % HOUR) / MIN);
	const seconds = Math.floor((ms % MIN) / SEC);

	// Build time string with non-zero values
	const parts = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (seconds > 0) parts.push(`${seconds}s`);

	return `${parts.join(' ')} ago`;
}

export { foundPos, FoundPos, highlightRect, outputMessage, checkmark, timeDiff };
