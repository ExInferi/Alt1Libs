import * as A1 from 'alt1/base';
import ChatboxReader, { ChatLine } from 'alt1/chatbox';

/**
 * By default, the ChatboxReader will be able to read the colors defined in the library's default colors array.
 * In a lot of cases, you will want to use your own definition of colors like this:
 * reader.readargs.colors = [A1.mixColor(255, 255, 255), A1.mixColor(0, 0, 0)];
 *
 * The reader can find multiple chatboxes on the screen, where the first one will be main chatbox,
 * unless there are multiple chatboxes with the type "main" found. In that case, the last found chatbox
 * with the type "main" will be the main chatbox.
 */

// Create a new ChatboxReader instance
const reader = new ChatboxReader();

// Local boolean to check if we have a chatbox position
let chatboxFound = false;

// Starter function for the chatbox reading
function chatbox(imgref: A1.ImgRef | null, selector?: string) {
	// Cancel if there's no Alt1 Toolkit or no image reference
	if (!window.alt1 || !imgref) {
		// Clear the output in case this was a call to stop reading
		if (selector) {
			const output = document.querySelector(selector);
			if (!output) throw new Error(`Selector '${selector}' not found`);
			output.innerHTML = '';
		}
		return (chatboxFound = false);
	}

	if (!chatboxFound) {
		// Try to find the chatbox position
		reader.find(imgref);
		if (reader.pos === null) {
			return console.log('Chatbox position not found, trying to find...');
		} else {
			// Force the first "main" chatbox found to be the actual main chatbox
			if (reader.pos.boxes[0].type === 'main') {
				reader.pos.mainbox = reader.pos.boxes[0];
			}
			console.log('Chatbox position found:', reader.pos);
			// Set the chatbox as found so future calls will not try to find it again
			chatboxFound = true;
			// Highlight the main chatbox
			highlightChatbox();
			// Create a selection dropdown for the chatboxes
			selectChatbox(selector);
		}
	}

	// Read the chatbox from the current screen
	const chat: ChatLine[] | null = reader.read(imgref);

	// Update the page with the read chat
	if (chat && chat.length > 0) {
		updatePage(chat, selector);
	}
}
/**
 * We can access the chatbox positions and use this to create an overlay on the chatbox that was found.
 * We can also have users specify the specific chatbox they'd like to read from.
 */

// Highlight the chatbox currently being read from
function highlightChatbox() {
	// There's no use for this if there isn't a position found
	if (!reader.pos) return;
	// Get the position and dimensions of the chatbox
	const rect = reader.pos.mainbox.rect;
	// The overlay functions exist within the global alt1 namespace
	alt1.overLayRect(
		// The color of the overlay, in this case golden yellow
		A1.mixColor(255, 211, 63),
		// The position and dimensions of the chatbox
		rect.x,
		rect.y,
		rect.width,
		rect.height,
		// How long the overlay needs to be displayed in ms
		2000,
		// The width of the overlay in pixels
		3,
	);
}

// Create selection options for which chatbox to read from
function selectChatbox(selector = 'body') {
	// Check if the chatbox position is found
	if (!chatboxFound || !reader.pos) return;
	// Define the parent element to append the select to
	const parent = document.querySelector(selector) as HTMLElement;
	// Create new selection options
	const select = document.createElement('select');
	select.className = 'nisdropdown';
	select.style.position = 'sticky';
	select.style.top = '0';
	// Go through all found chatboxes and create an option for each
	reader.pos.boxes.map((box, index) => {
		const option = document.createElement('option');
		option.value = index.toString();
		option.text = `Chatbox ${index + 1}`;
		// Check if the chatbox is the main chatbox and make that the selected option
		box.rect === reader.pos.mainbox.rect && (option.selected = true);
		// Add the options to the select
		select.appendChild(option);
		console.log(reader.pos.mainbox.rect);
	});
	// Add an event listener to the select to change the chatbox being read from
	select.addEventListener('change', (e) => {
		// Get the index of the selected chatbox
		const index = parseInt((e.target as HTMLSelectElement).value);
		// Set the chatbox to read from the selected index
		reader.pos.mainbox = reader.pos.boxes[index];
		// Highlight the newly selected chatbox
		highlightChatbox();
	});
	// Append the select to the specified selector
	parent.appendChild(select);
}

// Update the page with the chat text being read
function updatePage(chat: ChatLine[], selector = 'body') {
	// Filter out chat lines with no text fragments
	const filteredChat = chat.filter((line) => line.fragments.length > 0);
	// Cancel if there's no chat text to display
	if (!filteredChat.length) return;
	// Create paragraph to display the chat text
	const p = document.createElement('p');
	p.style.margin = '0'; // Removing any default margins for better readability

	// Get the all the lines of chat text from the chatbox
	const text = filteredChat
		.map((line) => {
			// Map through the fragments of the chat line and give them their original color
			return line.fragments
				.map((frag) => {
					const { color, text } = frag;
					const s = document.createElement('span');
					s.style.color = `rgb(${[...color]})`;
					s.textContent = text; // Use textContent to sanitize the text
					return s.outerHTML; // Return the outerHTML of the created span element
				})
				.join('');
		})
		.join('<br>');

	p.innerHTML = text;
	document.querySelector(selector).appendChild(p);

	// Scroll to the last appended child
	p.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

export default chatbox;
