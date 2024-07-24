import { Controller } from '@hotwired/stimulus';
import { elCreate } from '@dpsys/js-utils/element/util';
import { cLog, createEnum, pause } from '@dpsys/js-utils/misc';
import './style.css';


var State = createEnum(['CLOSED', 'OPENED', 'OPENING', 'CLOSING']);


export default class ModalWindow extends Controller 
{
    opener = null;
    content = null;
    closer = null;

    static values = 
    {
        state: {type: String, default: State.CLOSED},
        openDurationMs: Number,
        closeDurationMs: Number,
        opener: String,
        clickOutsideIgnore: Array,
    }

    connect() 
    {
        this.element.classList.add('modal_window');

        let el_content = this.element.querySelector('.modal_window_content');
        if (!el_content)
        {
            el_content = elCreate('div', {'class': 'modal_window_content'});
            this.element.appendChild(el_content);

            // Move user specified contents into content container 
            [...this.element.children].forEach( (el) =>
            {
                if (el.classList.contains('modal_window_content') || el.classList.contains('modal_window_closer')) {return;}
                // cLog('appending to content container: ', el, this.connect);
                el_content.appendChild(el);
            })
        }
        this.content = el_content;

        this.closer = this.element.querySelector('.modal_window_closer');
        if (this.closer)
        {
            this.closer.addEventListener('click', this.close);
        }

        if (this.openerValue)
        {
            document.addEventListener('click', this.openerCallback);
        }

        switch (this.stateValue)
        {
            case State.OPENED:
                this.element.classList.add('opened');
                this.element.style.visibility = 'visible';
                break;
            case State.CLOSED:
                this.element.classList.add('closed');
                this.element.style.visibility = '';
                break;
        }

        document.addEventListener('click', this.clickOutside);
    }

    openerCallback = (e) =>
    {
        let el_opener = e.target.closest(this.openerValue); if (!el_opener) {return;}
        this.opener = el_opener;
        this.open();
    }
    
    open = async () =>
	{        
		if (this.stateValue === State.OPENED) {return;}	//cLog ('otevřít', null, this.open);	
					
		if (this.openBeforeCallback) {await this.openBeforeCallback();}

		this.stateValue = State.OPENING;
        this.element.classList.add('opening');
		this.element.style.visibility = 'visible';
					
		setTimeout( ()=> 
		{
			this.stateValue = State.OPENED;
            this.element.classList.add('opened');
            this.element.classList.remove('closed');   
            this.element.classList.remove('opening');
		}
		, this.openDurationMsValue);
	}

    close = async () =>
	{																		
		if ( this.stateValue === State.CLOSED ) {return;}					
				
		this.stateValue = State.CLOSING;
        this.element.classList.add('closing');
		
		await pause(this.closeDurationMsValue);
	
		this.stateValue = State.CLOSED;
        this.element.classList.add('closed');   
        this.element.classList.remove('opened');
        this.element.classList.remove('closing');
		this.element.style.visibility = '';
	}

    clickOutside = (e) =>
	{
        // Ignore closest element if specified
        var ignoreClosestFound = false;
        this.clickOutsideIgnoreValue.forEach( (ignoreCssSel)=>
        {						
            if (e.target.closest(ignoreCssSel)) {ignoreClosestFound = true;}
        });
        if (ignoreClosestFound) {return;}

		var isClickInside = this.element.contains(e.target);
		
		if ( this.stateValue === State.OPENED  &&  !isClickInside ) {this.close();}
	}	
}
