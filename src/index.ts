import * as A1 from 'alt1/base';
import * as OCR from 'alt1/ocr';

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

	// Set up a screen capture at an interval, based on a button click
	let screen: A1.ImgRef | null = null;
	// Set the interval to the recommended interval based on capture method, defaults to 600ms
	let interval = alt1.captureInterval || 600;
	let captureInterval: ReturnType<typeof setInterval> | null = null;

	// The set of functions to run on the screen capture
	const run = () => {
		chatbox(screen, '#chatbox');
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

	// Dialog reader output
	const dialogOutput = document.querySelector('#dialog') as HTMLDivElement;

	dialogOutput.textContent = 'This has not been implemented yet.';

	// Dropsmenu reader output
	const dropsmenuOutput = document.querySelector('#dropsmenu') as HTMLDivElement;

	dropsmenuOutput.textContent = 'This has not been implemented yet.';

	// Target mob reader output
	const targetmobOutput = document.querySelector('#targetmob') as HTMLDivElement;

	targetmobOutput.textContent = 'This has not been implemented yet.';

	// Tooltip reader output
	const tooltipOutput = document.querySelector('#tooltip') as HTMLDivElement;

	tooltipOutput.textContent = 'This has not been implemented yet.';
}
