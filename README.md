# Stimulus Modal Window

[![NPM Downloads](https://img.shields.io/npm/dm/%40dpsys%2Fstimulus-modal-window)](https://www.npmjs.com/package/@dpsys/stimulus-modal-window)
[![ISC License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Supports CJS, ESM and TypeScript.

## Installation
1. Run: `npm i @dpsys/stimulus-modal-window`
2. Register this controller in your bootstrap file:
``` js
import ModalWindow from "@dpsys/stimulus-modal-window";
...
stimulusApp.register('modal-window', ModalWindow);
```

3. (Optional) Import the base CSS style:
``` js
import "@dpsys/stimulus-modal-window/base.css";
```


## Usage

### Basic window
This example uses Symfony, Twig and Tailwind. Use your own implementation if needed.
``` twig
<button class="main" data-mw-opener-something>Open window</button> {# Name of data attribute can be anything. E.g.: data-foo-bar  #}

<div class="modal_window top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', {opener: '[data-mw-opener-something]'}) }}>

    <div class="modal_window_closer">X</div> {# Optional. Specify if needed. #}

    <div class="modal_window_content"> {# Optional. Gets created automatically if doesn't exist. #} 
        My content ...
    </div>
</div>
```

### If a window needs to have it's own logic
1. Choose arbitrary name for a controller
`... {{ stimulus_controller('mw-something', ...`

2. Create such controller
``` js
// .../controllers/mw-something-controller.js
import ModalWindow from '@dpsys/stimulus-modal-window';

export default class extends ModalWindow
{
	connect()
	{
		super.connect();

		...
	}

	async openBefore()
	{
		alert('The window is going to open');
	}
}
```

### Access elements inside controller
`this.element` - the window

`this.content` - content wrapper of the window

`this.opener` - last clicked element which opened the window

`this.closer` - closer element


## Methods
### open()
Opens the window
### close()
Closes the window


## Settings
### state : String
Default state of a window on page load.

Possible values: 'CLOSED' (default), 'OPENED', 'OPENING', 'CLOSING'

### openDurationMs : Number
Opening duration in milliseconds

Default: 0

### closeDurationMs : Number
Closing duration in milliseconds

Default: 0

### opener : String
CSS selector of element/s which opens the window.

If the window has its own Controller, the opener doesn't need to be specified - window can be opened/closed just programatically.

Default: null

### clickOutsideIgnore : Array
CSS selector/s of clicked element/s outside window, which will not close the window

Default: []


## Callbacks
Define these methods in your extended class if you need to execute some code when the state of the window is being changed (see example above)

### openBefore()
Do something before the window starts opening
### openAfter()
Do something after the window finishes opening
### closeBefore()
Do something before the window starts closing
### closeAfter()
Do something after the window finishes closing


## Styling

### Opening, closing
#### Vanilla CSS
``` css
.modal_window.closed {opacity: 0; transition: opacity 0.5s ease-in;}
.modal_window.closed.opening {opacity: 1;}
.modal_window.opened {opacity: 1; transition: opacity 0.3s ease-out;}
.modal_window.opened.closing {opacity: 0;}

```

#### Tailwind CSS
``` html
<div class="modal_window ...
    [&.closed]:opacity-0 [&.closed]:[transition:opacity_0.5s_ease-in]
    [&.closed.opening]:opacity-100
    [&.opened]:opacity-100 [&.opened]:[transition:opacity_0.3s_ease-out]
    [&.opened.closing]:opacity-0" 
    ... >
    ...
</div>
```


## Troubleshooting

### Flash of unstyled content on page load
Add `modal_window` class to the main element:

`<div class="`**`modal_window`**` top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', ...) }}>`