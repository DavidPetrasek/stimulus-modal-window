# Installation
1. Register controller. This example uses vite-helpers. Use your own implementation.
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
This example uses Symfony, Twig and Tailwind. Use your own implementation.
```
<button class="main" data-mw-opener-something>Open window</button>

<div class="top-[15vh] right-[25vw]" {{ stimulus_controller('modal-window', {multipleOpenersQuerySelector: '[data-mw-opener-something]'}) }}>

    <div class="modal_window_closer">X</div> // Optional

    <div class="modal_window_content"> // Optional
        My content ...
    </div> // Optional
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

# Settings
### state : String
Possible values: 'CLOSED', 'OPENED', 'OPENING', 'CLOSING'
### openDurationMs : Number
Openning duration in milliseconds
### closeDurationMs : Number
Closing duration in milliseconds
### multipleOpenersQuerySelector : String (required)
Query selector for element/s which opens the window. Opener element is then accessible by `this.opener`
### clickOutsideIgnoreClosestQuerySelectors : Array
Query selector/s of element/s which will not close the window when clicked outside of it
### addCloser (Boolean)
Whether to add a close button

# Styling
```
.modal_window.closed {opacity: 0; transition: opacity 0.5s ease-in;}
.modal_window.openning {opacity: 1;}

.modal_window.opened {opacity: 1; transition: opacity 0.5s ease-out;}
.modal_window.closing {opacity: 0;}

```