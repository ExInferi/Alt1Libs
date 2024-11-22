// Get the current settings
const header = document.querySelector('header') as HTMLElement;
const isHeaderVisible = header.style.display !== 'none';
const info = document.querySelector('#info') as HTMLTableElement;
const isInfoVisible = info.style.display !== 'none';
const libs = document.querySelector('#libs') as HTMLElement;
const isLibsVisible = libs.style.display !== 'none';
const root = document.documentElement as HTMLElement;
const fontSize = parseInt(getComputedStyle(root).fontSize, 10);

// The HTML for the settings popup
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Settings</title>
        <link rel="stylesheet" type="text/css" href="https://runeapps.org/nis/nis.css">
        <style>
            body.nis {
                text-align: center;
            }
            label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5em;
            white-space: nowrap;
            }
        </style>
</head>
<body class="nis">
<h1>Settings</h1>
<label for="header">
            Show header
    <input type="checkbox" id="header" ${isHeaderVisible ? 'checked' : ''}>
</label>
        <label for="info">
            Show info
            <input type="checkbox" id="info" ${isInfoVisible ? 'checked' : ''}>
        </label>
        <label for="libs">
            Show libraries
            <input type="checkbox" id="libs" ${isLibsVisible ? 'checked' : ''}>
        </label>
        <label for="font">
            Font size
            <input type="range" id="font" min="8" max="28" step="2" value="${fontSize}">
        </label>
        <script>
            const settings = {
                header: ${isHeaderVisible},
                info: ${isInfoVisible},
                libs: ${isLibsVisible},
                font: ${fontSize},
            };
            // Access the font size range input
            const fontInput = document.getElementById('font');
            // Access the checkbox elements
            const checkboxes = document.querySelectorAll('[type="checkbox"]');
            
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
            fontInput.addEventListener('input', function() {
                const settingName = this.id;
                const settingValue = this.value;
                settings[settingName] = settingValue;
                localStorage.libsFont = JSON.stringify(settingValue);
                window.opener.updateSettings(settings);
            });
        </script>
</body>
</html>
`;

// Add a function to window to update the settings
(window as any).updateSettings = function (settings: {
	header: boolean;
	info: boolean;
	libs: boolean;
	font: number;
}) {
	const header = document.querySelector('header') as HTMLElement;
	header.style.display = settings.header ? 'block' : 'none';
	const info = document.querySelector('#info') as HTMLTableElement;
	info.style.display = settings.info ? 'table' : 'none';
	const libs = document.querySelector('#libs') as HTMLElement;
	libs.style.display = settings.libs ? 'block' : 'none';
	const root = document.documentElement as HTMLElement;
	root.style.fontSize = `${settings.font}px`;
};

// The settings popup
function openSettings() {
	const settingsPopup = window.open('', 'settings', 'width=200,height=200');

	if (settingsPopup) {
		// Write the HTML content for the settings window
		settingsPopup.document.write(html);

		settingsPopup.document.close();
	}
}

export default openSettings;
