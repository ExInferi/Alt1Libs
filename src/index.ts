import * as A1 from 'alt1/base';
import * as OCR from 'alt1/ocr';
import { foundPos, FoundPos, checkmark, timeDiff } from './libs/util';
import openSettings from './libs/settings';

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

// Update font size based on local storage
window.addEventListener('load', () => {
	// Get stored font size or default to 16
	const storedFont = localStorage.getItem('libsFont');
	const fontSize = storedFont ? JSON.parse(storedFont) : 16;
	// Update root font size
	const root = document.documentElement;
	root.style.fontSize = `${fontSize}px`;
	// Verify the change
	console.log('Applied fontSize:', getComputedStyle(root).fontSize);
});

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
			element.dataset.found = checkmark(foundPos[key]);
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

	// Set initial libs text
	const details = document.querySelectorAll(
		'details[name="libs"] > div',
	) as NodeListOf<HTMLDetailsElement>;
	details.forEach((detail) => {
		const implemented = detail.id === 'chatbox' || detail.id === 'targetmob';
		implemented ?
			(detail.textContent = 'Press Start to begin reading')
		:	(detail.textContent = 'This has not been implemented yet.');
	});

	// Settings for the app
	const settingsButton = document.querySelector('#settings') as HTMLButtonElement;
	settingsButton.onclick = openSettings;

	// Add detected information to table
	function buildInfo() {
		const now = Date.now();
		const tbody = document.querySelector('#info tbody') as HTMLTableSectionElement;
		tbody.innerHTML = '';
		// Bools in a separate object for easier access
		const bool = {
			g: alt1.permissionGameState,
			i: alt1.permissionInstalled,
			o: alt1.permissionOverlay,
			p: alt1.permissionPixel,
			l: alt1.rsLinked,
			c: alt1.permissionGameState ? alt1.currentWorld > 0 : false,
			h: alt1.permissionGameState ? alt1.lastWorldHop > 0 : false,
		};

		const info = {
			// Version of Alt1 Toolkit
			'Alt1 version': alt1.version,
			// Window skin selected by user in settings
			'Preferred theme': alt1.skinName,
			// Capture method used by Alt1
			'Capture method': alt1.captureMethod,
			// Recommended interval based on capture method
			'Recommended interval': `${alt1.captureInterval}ms`,
			// App permissions
			'App installed': checkmark(bool.i),
			'GameState permission': checkmark(bool.g),
			'Overlay permission': checkmark(bool.o),
			'Pixel permission': checkmark(bool.p),
			// Display how the app was opened
			'App opened through': bool.i ? JSON.parse(alt1.openInfo).openMethod : 'App not installed',
			// Informations about the screen(s) detected
			'User screen(s)': `X: ${alt1.screenX}, Y: ${alt1.screenY}, Size: ${alt1.screenWidth}x${alt1.screenHeight}`,
			// Information about the RuneScape client window
			'RS window linked': checkmark(bool.l),
			'RS window':
				bool.l ?
					`X: ${alt1.rsX}, Y: ${alt1.rsY}, Size: ${alt1.rsWidth}x${alt1.rsHeight}`
				:	'RS not linked',
			'RS DPI scaling': bool.l ? `${alt1.rsScaling * 100}%` : 'RS not linked',
			'RS active': bool.g ? checkmark(alt1.rsActive) : 'GameState required',
			'RS last active': bool.g ? timeDiff(alt1.rsLastActive) : 'GameState required',
			'RS ping': bool.g ? `${alt1.rsPing}ms` : 'GameState required',
			'RS FPS': bool.g ? Math.round(alt1.rsFps) : 'GameState required',
			// Information about the world detection
			'Current world':
				bool.g ?
					bool.c ?
						`w${alt1.currentWorld}`
					:	'Unknown'
				:	'GameState required',
			'Last world hop':
				bool.g ?
					bool.h ?
						timeDiff(now - alt1.lastWorldHop)
					:	'Unknown'
				:	'GameState required',
		};
		// Add the information to the table
		for (const [key, value] of Object.entries(info)) {
			const row = document.createElement('tr');
			const th = document.createElement('th');
			const td = document.createElement('td');
			th.textContent = key;
			td.textContent = value.toString();
			row.appendChild(th);
			row.appendChild(td);
			tbody.appendChild(row);
		}
	}

	// Build table on interval
	const buildTable = setInterval(() => buildInfo(), 1000);

	// Cleanup on closing the app
	window.addEventListener('beforeunload', () => {
		if (alt1.permissionInstalled) alt1.clearBinds();
		clearInterval(buildTable);
	});

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
}
