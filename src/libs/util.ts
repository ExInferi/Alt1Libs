import * as A1 from 'alt1/base';

// State tracking for positions
type FoundPos = {
	animal: boolean;
	bosstimer: boolean;
	buffs: boolean;
	chatbox: boolean;
	dialog: boolean;
	dropsmenu: boolean;
	targetmob: boolean;
	tooltip: boolean;
};

const foundPos: FoundPos = {
	animal: false,
	bosstimer: false,
	buffs: false,
	chatbox: false,
	dialog: false,
	dropsmenu: false,
	targetmob: false,
	tooltip: false,
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

// Output a message to a specific selector to reduce code duplication
function outputMessage(message: string, selector: string) {
	const output = document.querySelector(selector);
	if (!output) throw new Error(`Selector '${selector}' not found`);
	output.textContent = message;
}

export { foundPos, FoundPos, highlightRect, outputMessage };
