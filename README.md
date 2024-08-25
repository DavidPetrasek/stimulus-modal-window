Install: `npm i @dpsys/stimulus-modal-window`

Submit any issues here: https://github.com/DavidPetrasek/stimulus-modal-window/issues

###
###
# Installation
1. Register this controller. This example uses vite-helpers. Use your own implementation if needed.
``` javascript
import { Application } from "@hotwired/stimulus";
import { registerControllers } from 'stimulus-vite-helpers'
import ModalWindow from "@dpsys/stimulus-modal-window";

const stimulusApp = Application.start();
const stimulusControllers = import.meta.glob('../**/*_controller.js', { eager: true })
registerControllers(stimulusApp, stimulusControllers);
stimulusApp.register('modal-window', ModalWindow);
```

2. If not using bundler like vite you have to manually load style.css

###
###
# Usage

## Basic window
This example uses Symfony, Twig and Tailwind. Use your own implementation if needed.
``` html
<button class="main" data-mw-opener-something>Open window</button> {# Name of data attribute can be anything. E.g.: data-foo-bar  #}

<div class="modal_window top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', {opener: '[data-mw-opener-something]'}) }}>

    <div class="modal_window_closer">X</div> {# Optional. Specify if needed. #}

    <div class="modal_window_content"> {# Optional. Gets created automatically if doesn't exist. #} 
        My content ...
    </div>
</div>
```

## If a window needs to have it's own logic
1. Choose arbitrary name for a controller
`... {{ stimulus_controller('mw-something', ...`

2. Create such controller
``` javascript
// .../controllers/mw-something-controller.js
import ModalWindow from '@dpsys/stimulus-modal-window';

export default class extends ModalWindow
{
	connect()
	{
		super.connect();

		...
	}

	async customMethodOne()
	{	
        ...															
	}

	async openBeforeCallback()
	{
		alert('The window is going to open');
	}
}
```

## Access elements inside controller
`this.content` - content wrapper

`this.opener` - clicked element used to open current window

`this.closer` - closer element

## Methods
### open()
Opens the window
### close()
Closes the window

## Callbacks
Define these methods in your extended class if you need to execute some code when the state of the window is being changed (see example above)

### openBeforeCallback()
Do something before the window starts opening
### openAfterCallback()
Do something after the window finishes opening
### closeBeforeCallback()
Do something before the window starts closing
### closeAfterCallback()
Do something after the window finishes closing

###
###
# Settings
### state : String
Default state of a window on page load.

Possible values: CLOSED (default), OPENED, OPENING, CLOSING

### openDurationMs : Number
Opening duration in milliseconds
### closeDurationMs : Number
Closing duration in milliseconds
### opener : String
CSS selector of element/s which opens the window
### clickOutsideIgnore : Array
CSS selector/s of clicked element/s outside current window, which will not close the window

###
###
# Styling
``` css
.modal_window.closed {opacity: 0; transition: opacity 0.5s ease-in;}
.modal_window.opening {opacity: 1;}

.modal_window.opened {opacity: 1; transition: opacity 0.5s ease-out;}
.modal_window.closing {opacity: 0;}

```

###
###
# Troubleshooting

## Flash of unstyled content on page load
Add `modal_window` class to the main element:

`<div class="`**`modal_window`**` top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', ...) }}>`