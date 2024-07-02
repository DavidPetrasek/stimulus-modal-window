Install: `npm i @dpsys/stimulus-modal-window`

Submit any issues here: https://github.com/DavidPetrasek/stimulus-modal-window/issues

###
###
# Installation
1. Register this controller. This example uses vite-helpers. Use your own implementation if needed.
```
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
```
<button class="main" data-mw-opener-something>Open window</button>

<div class="top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', {opener: '[data-mw-opener-something]'}) }}>

    <div class="modal_window_closer">X</div> // If not specified, gets created automatically only if addCloser is set to true.

    <div class="modal_window_content"> // If not specified, gets created automatically.
        My content ...
    </div>
</div>
```

## If a window needs to have it's own logic
1. Specify custom name for a controller
`... {{ stimulus_controller('mw-something', ...`

2. create such controller
```
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
}
```
## Access elements inside controller
`this.content` - content wrapper

`this.opener` - clicked element used to open current window

###
###
# Settings
### state : String
Possible values: 'CLOSED', 'OPENED', 'OPENING', 'CLOSING'
### openDurationMs : Number
Openning duration in milliseconds
### closeDurationMs : Number
Closing duration in milliseconds
### opener : String (required)
CSS selector of element/s which opens the window.
### clickOutsideIgnore : Array
CSS selector/s of clicked element/s outside current window, which will not close the window
### addCloser (Boolean)
Whether to add a close button

###
###
# Styling
```
.modal_window.closed {opacity: 0; transition: opacity 0.5s ease-in;}
.modal_window.openning {opacity: 1;}

.modal_window.opened {opacity: 1; transition: opacity 0.5s ease-out;}
.modal_window.closing {opacity: 0;}

```