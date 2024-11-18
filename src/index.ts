import * as A1 from 'alt1/base';
import * as OCR from 'alt1/ocr';
import { foundPos, FoundPos } from './libs/util';

// imports for the libraries
import animal from './libs/animal';
import bossTimer from './libs/bosstimer';
import buffs from './libs/buffs';
import chatbox from './libs/chatbox';
import dialog from './libs/dialog';
import dropsMenu from './libs/dropsmenu';
import target from './libs/targetmob';
import tooltip from './libs/tooltip';

// Webpack imports for dist files
import './index.html';
import './styles.css';
import './assets/appconfig.json';
import './assets/icon.png';

// Main element
const main = document.querySelector('main') as HTMLElement;

// If the app is not running in alt1, display a message to install the app
if (!window.alt1) {
	// Create a base app URL, to make it work both in development and production
	const appURL = window.location.href.replace(/index\..*/, '');
	main.innerHTML = `Click <a href="alt1://addapp/${appURL}appconfig.json">here</a> to add this app to Alt1 Toolkit.`;
} else {
	// Let alt1 know about the app
	A1.identifyApp('appconfig.json');

	// Add the user's app skin as theme to the document
	document.documentElement.dataset.theme = alt1.skinName;

	// Set up a screen capture at an interval, based on a button click
	let screen: A1.ImgRef | null = null;
	// Set the interval to the recommended interval based on capture method, defaults to 600ms
	let interval = alt1.captureInterval || 600;
	let captureInterval: ReturnType<typeof setInterval> | null = null;

	// Found state elements
	const foundState = document.querySelectorAll('[data-found]') as NodeListOf<HTMLElement>;
	// The set of functions to run on the screen capture
	const run = () => {
		chatbox(screen, '#chatbox');
		target(screen, '#targetmob');

		// Update the found state elements
		foundState.forEach((element, index) => {
			const key = Object.keys(foundPos)[index] as keyof FoundPos;
			element.dataset.found = foundPos[key] ? '✔' : '✘';
		});
	};

	// The buttons to start and stop the screen capture
	const startButton = document.querySelector('#start') as HTMLButtonElement;
	const stopButton = document.querySelector('#stop') as HTMLButtonElement;

	startButton.addEventListener('click', () => {
		if (captureInterval) {
			clearInterval(captureInterval);
		}
		// First capture the screen, and then start the interval after a delay
		screen = A1.captureHoldFullRs();
		run();

		setTimeout(() => {
			captureInterval = setInterval(() => {
				screen = A1.captureHoldFullRs();
				run();
			}, interval);
		}, 1000);
		stopButton.disabled = false;
		startButton.disabled = true;
	});

	stopButton.addEventListener('click', () => {
		// Clear the interval and the screen capture
		screen = null;
		clearInterval(captureInterval);
		// A final run to let the readers know the capture has stopped
		run();

		stopButton.disabled = true;
		startButton.disabled = false;
	});

	// Animal reader output
	const animalOutput = document.querySelector('#animal') as HTMLDivElement;

	animalOutput.textContent = 'This has not been implemented yet.';

	// Bosstimer reader output
	const bosstimerOutput = document.querySelector('#bosstimer') as HTMLDivElement;

	bosstimerOutput.textContent = 'This has not been implemented yet.';

	// Buffs reader output
	const buffsOutput = document.querySelector('#buffs') as HTMLDivElement;

	buffsOutput.textContent = 'This has not been implemented yet.';

	// Chatbox reader output
	const chatboxOutput = document.querySelector('#chatbox') as HTMLDivElement;

	chatboxOutput.textContent = 'Press Start to begin reading';

	// Dialog reader output
	const dialogOutput = document.querySelector('#dialog') as HTMLDivElement;

	dialogOutput.textContent = 'This has not been implemented yet.';

	// Dropsmenu reader output
	const dropsmenuOutput = document.querySelector('#dropsmenu') as HTMLDivElement;

	dropsmenuOutput.textContent = 'This has not been implemented yet.';

	// Target mob reader output
	const targetmobOutput = document.querySelector('#targetmob') as HTMLDivElement;

	targetmobOutput.textContent = 'Press Start to begin reading';

	// Tooltip reader output
	const tooltipOutput = document.querySelector('#tooltip') as HTMLDivElement;

	tooltipOutput.textContent = 'This has not been implemented yet.';
}

// Settings for the app
const settingsButton = document.querySelector('#settings') as HTMLButtonElement;
settingsButton.onclick = openSettings;

function openSettings() {
	const settingsPopup = window.open('', 'settings', 'width=100,height=200');

	if (settingsPopup) {
		// Get the current settings
		const header = document.querySelector('header') as HTMLElement;
		const isHeaderVisible = header.style.display !== 'none';

		// Write the HTML content for the settings window
		settingsPopup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Settings</title>
				<link rel="stylesheet" type="text/css" href="https://runeapps.org/nis/nis.css">
      </head>
      <body class="nis" style="text-align:center;">
        <h1>Settings</h1>
        <label for="header">
					Show header
          <input type="checkbox" id="header" ${isHeaderVisible ? 'checked' : ''}>
        </label>

				<script>
					// Access the checkbox elements
					const checkboxes = document.querySelectorAll('[type="checkbox"]');
					const settings = {
						header: ${isHeaderVisible},
					};
					
					// Loop through each checkbox and add an event listener
					checkboxes.forEach((checkbox) => {
						checkbox.addEventListener('change', function() {
							const settingName = this.id;
							const settingValue = this.checked;
							settings[settingName] = settingValue;
							// Call updateSettings function in the main window
							window.opener.updateSettings(settings);
						});
					});
				</script>
      </body>
      </html>
    `);

		settingsPopup.document.close();
	}
}

// Add a function to window to update the settings
(window as any).updateSettings = function (settings: { header: boolean }) {
	const header = document.querySelector('header') as HTMLElement;
	header.style.display = settings.header ? 'block' : 'none';
};

// Toggle details as name attribute is not supported in Chromium < 120
document.addEventListener('DOMContentLoaded', () => {
	const details = document.querySelectorAll('details[name="libs"]');

	details.forEach((detail) => {
		detail.querySelector('summary')?.addEventListener('click', (e) => {
			e.preventDefault(); // Prevent default toggle behavior

			// Close all other details
			details.forEach((d) => d !== detail && d.removeAttribute('open'));

			// Toggle current detail
			detail.toggleAttribute('open');
		});
	});
});
