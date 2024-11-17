import TargetMobReader from 'alt1/targetmob';
import * as A1 from 'alt1';
import { foundPos, highlightRect } from './util';
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

// Starter function for the target reading
function target(imgref: A1.ImgRef | null, selector?: string) {
	// Cancel if there's no Alt1 Toolkit or no image reference
	if (!window.alt1 || !imgref) {
		// Clear the output in case this was a call to stop reading
		if (selector) {
			const output = document.querySelector(selector);
			if (!output) throw new Error(`Selector '${selector}' not found`);
			output.textContent = 'Press Start to begin reading';
		}
		return (foundPos.targetmob = false);
	}

	if (!foundPos.targetmob) {
		reader.read(imgref);
		if (reader.lastpos === null) {
			return console.log('Target position not found, trying to find...');
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
	const output = document.querySelector(selector);
	if (!output) throw new Error(`Selector '${selector}' not found`);
	output.textContent = `Name: ${mob.name}, HP: ${mob.hp}`;
}
export default target;
