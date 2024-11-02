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
import './appconfig.json';
import './icon.png';

// Main element
const main = document.querySelector('main') as HTMLElement;

// Let alt1 know about the app
A1.identifyApp('appconfig.json');

// If the app is not running in alt1, display a message to install the app
if (!window.alt1) {
	// Create a base app URL, to make it work both in development and production
	const appURL = window.location.href.replace(/index\..*/, '');
	main.innerHTML = `Click <a href="alt1://addapp/${appURL}appconfig.json">here</a> to add this app to Alt1 Toolkit.`;
}

// Helper function to disable buttons when a lib is currently active
function toggleButtons(halt: boolean) {
	const buttons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

	buttons.forEach((button) => {
		if (!halt && button.dataset.active === 'false') {
			button.disabled = true;
		} else {
			button.disabled = false;
		}
	});
}

// Animal reader
const animalButton = document.querySelector('#animal') as HTMLButtonElement;

animalButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Bosstimer reader
const bosstimerButton = document.querySelector('#bosstimer') as HTMLButtonElement;

bosstimerButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Buffs reader
const buffsButton = document.querySelector('#buffs') as HTMLButtonElement;

buffsButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Chatbox reader
const chatButton = document.querySelector('#chatbox') as HTMLButtonElement;
let chatboxHalted = true;

chatButton.addEventListener('click', () => {
	console.log('Button clicked, chatboxHalted:', chatboxHalted);
	chatbox(chatboxHalted, 'main');
	chatboxHalted = !chatboxHalted;
	chatButton.dataset.active = chatboxHalted ? 'false' : 'true';
	// Disable the button while processing
	toggleButtons(chatboxHalted);
	chatButton.disabled = true;
	chatButton.querySelector('span').textContent = 'Loading';

	setTimeout(() => {
		chatButton.disabled = false;
		chatButton.querySelector('span').textContent = chatboxHalted ? 'Chatbox' : 'Stop';
	}, 3000);
});

// Dialog reader
const dialogButton = document.querySelector('#dialog') as HTMLButtonElement;

dialogButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Dropsmenu reader
const dropsmenuButton = document.querySelector('#dropsmenu') as HTMLButtonElement;

dropsmenuButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Target mob reader
const targetmobButton = document.querySelector('#targetmob') as HTMLButtonElement;

targetmobButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});

// Tooltip reader
const tooltipButton = document.querySelector('#tooltip') as HTMLButtonElement;

tooltipButton.addEventListener('click', () => {
	main.innerHTML = 'This has not been implemented yet.';
});
