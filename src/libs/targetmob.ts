import TargetMobReader from 'alt1/targetmob';
import * as A1 from 'alt1/base';
import { foundPos, highlightRect, outputMessage } from './util';
/**
 * By default, the TargetMobReader will be able to read target information from the RuneScape interface.
 * The reader looks for the target information panel which shows:
 * - The target's name
 * - The target's current HP
 *
 * The reader will find the target information panel only when you are in combat with an enemy.
 */

// Create a new TargetMobReader instance
const reader = new TargetMobReader();

// Boolean to check if we have a target position
foundPos.targetmob = false;

/**
 *  Starter function for the target reading
 *
 * The function performs the following steps:
 * 1. Checks if the Alt1 Toolkit is available and if the image reference is provided.
 *		- If not, it clears the output message (if a selector is provided) and sets `foundPos.targetmob` to false.
 * 2. If the target position has not been found yet, it tries to read the position from the image reference.
 *    - If the position is not found, it updates the output message (if a selector is provided) and returns.
 *    - If the position is found, it logs the position, updates the foundPos state, and highlights the area.
 * 3. Reads the target information (such as HP and name) from the current screen.
 *    - If the target information is found, it updates the page with this information using the provided selector.
 * @param imgref - The screen capture reference from Alt1 Toolkit, or null if not available.
 * @param selector - An optional CSS selector to update the output message.
 */
function target(imgref: A1.ImgRef | null, selector?: string) {
	// Cancel if there's no Alt1 Toolkit or no image reference
	if (!window.alt1 || !imgref) {
		// Clear the output in case this was a call to stop reading
		if (selector) outputMessage('Press Start to begin reading', selector);
		reader.lastpos = null;
		return (foundPos.targetmob = false);
	}

	if (!foundPos.targetmob) {
		reader.read(imgref);
		if (reader.lastpos === null) {
			const message = 'Target position not found, trying to find...';
			if (selector) outputMessage(message, selector);
			return;
		} else {
			console.log('Target position found:', reader.lastpos);
			// Set the target as found so future calls will not try to find it again
			foundPos.targetmob = true;
			// Destructure the x and y coordinates from the last position
			const { x, y } = reader.lastpos;
			// Highlight the target information based on the found position (offset needed)
			highlightRect(x - 151, y - 16, 200, 44);
		}
	}
	// Read the target information from the current screen
	const mob: { hp: number; name: string } | null = reader.read(imgref);

	if (mob) {
		// Update the page with the read target information
		updatePage(mob, selector);
	}
}

// Update the page with the read target information
function updatePage(mob: { hp: number; name: string }, selector = 'body') {
	const message = `Name: ${mob.name}, HP: ${mob.hp}`;
	outputMessage(message, selector);
}

export default target;
