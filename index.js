import { Controller } from '@hotwired/stimulus';
import { elCreate } from '@dpsys/js-utils/element/util';
import { cLog, createEnum, pause } from '@dpsys/js-utils/misc';
import './style.css';


var State = createEnum(['CLOSED', 'OPENED', 'OPENING', 'CLOSING']);


export default class ModalWindow extends Controller 
{
    opener = HTMLElement;
    content = HTMLElement;

    static values = 
    {
        state: {type: String, default: State.CLOSED},
        openDurationMs: Number,
        closeDurationMs: Number,
        multipleOpenersQuerySelector: String,
        clickOutsideIgnoreClosestQuerySelectors: Array,
        addCloser: {type: Boolean, default: true},
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

        let el_closer = this.element.querySelector('.modal_window_closer');
        if (this.addCloserValue && !el_closer)
        {
            el_closer = elCreate('div', {'class': 'modal_window_closer'}, 'X');
            this.element.appendChild(el_closer);
            el_closer.addEventListener('click', this.close);
        }

        if (this.multipleOpenersQuerySelectorValue)
        {
            document.addEventListener('click', this.multipleOpenersCallback);
        }

        document.addEventListener('click', this.clickOutside);
    } 

    multipleOpenersCallback = (e) =>
    {
        let el_opener = e.target.closest(this.multipleOpenersQuerySelectorValue); if (!el_opener) {return;}
        this.opener = el_opener;
        this.open();
    }
    
    open = async () =>
	{        
		if (this.stateValue === State.OPENED) {return;}	//cLog ('otevřít', null, this.open);	
					
		if (this.openBeforeCallback) {await this.openBeforeCallback();}

		this.stateValue = State.OPENING;
        this.element.classList.add('opening');   
        this.element.classList.remove('closed');
		this.element.style.visibility = 'visible';
					
		setTimeout( ()=> 
		{
			this.stateValue = State.OPENED;
            this.element.classList.add('opened');   
            this.element.classList.remove('opening');
		}
		, this.openDurationMsValue);
	}

    close = async () =>
	{																		
		if ( this.stateValue === State.CLOSED ) {return;}					
				
		this.stateValue = State.CLOSING;
        this.element.classList.add('closing');   
        this.element.classList.remove('opened');
		
		await pause(this.closeDurationMsValue);
	
		this.stateValue = State.CLOSED;
        this.element.classList.add('closed');   
        this.element.classList.remove('closing');
		this.element.style.visibility = '';
	}

    clickOutside = (e) =>
	{
        // Ignore closest element if specified
        var ignoreClosestFound = false;
        this.clickOutsideIgnoreClosestQuerySelectorsValue.forEach( (ignoreQSel)=>
        {						
            if (e.target.closest(ignoreQSel)) {ignoreClosestFound = true;}
        });
        if (ignoreClosestFound) {return;}

		var isClickInside = this.element.contains(e.target);
		
		if ( this.stateValue === State.OPENED  &&  !isClickInside ) {this.close();}
	}	
}
