// import * as A1 from '../../../alt1/dist/base';
// import ChatboxReader, { ChatLine } from '../../../alt1/dist/chatbox';
import * as A1 from 'alt1/base';
import ChatboxReader, { ChatLine } from 'alt1/chatbox';
// Create a new ChatboxReader instance
const reader = new ChatboxReader();
/**
 * By default, the ChatboxReader will be able to read the colors defined in the library's default colors array.
 * In a lot of cases, you will want to use your own definition of colors like this:
 * reader.readargs.colors = [A1.mixColor(255, 255, 255), A1.mixColor(0, 0, 0)];
 */

// Interval for looking for the chatbox every second
function findChat(start = true, callback: () => void) {
	const looking = setInterval(() => {
		// Cancel the interval if the app is not opened in alt1 or not running
		if (!window.alt1 || !start) {
			clearInterval(looking);
			reader.pos = null;
			return;
		}
		// Check if the chatbox position is found
		if (reader.pos === null && start) {
			reader.find();
			console.log('Chatbox position not found, trying to find...');
		} else {
			clearInterval(looking);
			console.log('Chatbox position found:', reader.pos);
			callback(); // Callback to start the other functions after finding the chatbox
		}
	}, 1000);
}

/**
 * The reader can find multiple chatboxes on the screen, where the first one will be main chatbox.
 * We can access the chatbox positions and use this to create an overlay on the chatbox that was found.
 * We can also have users specify the specific chatbox they'd like to read from.
 */

// Highlight the chatbox currently being read from
function highlightChatbox(start = true) {
	// There's no use for this if there isn't a position found
	if (!start || !reader.pos) return;
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
function selectChatbox(start = true, selector= 'body') {
	// Check if the chatbox position is found
	if (!start || !reader.pos) return;
	// Create new selection options
	const select = document.createElement('select');
	select.className = 'nisdropdown';
	select.style.position = 'fixed';
	// Go through all found chatboxes and create an option for each
	reader.pos.boxes.map((box, index) => {
		console.log(box);
		const option = document.createElement('option');
		option.value = index.toString();
		option.text = `Chatbox ${index + 1}`;
		// Check if the chatbox is the main chatbox and make that the selected option
		box.rect === reader.pos.mainbox.rect && (option.selected = true);
		// Add the options to the select
		select.appendChild(option);
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
	document.querySelector(selector)?.appendChild(select);
}

// Update the page with the chat text being read
function updatePage(chat: ChatLine[], selector= 'body') {
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

// Interval for reading the chatbox every half-tick
let readingInterval: ReturnType<typeof setInterval> | null = null;
function readChat(start = true, selector?: string) {
	// Cancel if there's no chatbox position or the start flag is false
	if (!start || !reader.pos) {
		clearInterval(readingInterval);
		if (selector) {
			const output = document.querySelector(selector);
			if (output) output.innerHTML = '';
		}
	}
	// Read the chatbox
	else {
		readingInterval = setInterval(() => {
			const chat: ChatLine[] | null = reader.read();
			// Update the page with the read chat
			if (chat) updatePage(chat, selector);
		}, 300);
	}
}

// Starter function for the chatbox reading
function chatbox(start = true, selector?: string) {
	// Clear the output if a selector is provided
	if (selector) {
		const output = document.querySelector(selector);
		if (output) {
			output.innerHTML = '';
		} else {
			throw new Error('Selector not found');
		}
	}

	// Go through the process of finding, highlighting, selecting, and reading the chatbox
	findChat(start, () => {
		highlightChatbox(start);
		selectChatbox(start, selector);
		readChat(start, selector);
		console.log('Started reading chatbox.');
	});
}

export default chatbox;
