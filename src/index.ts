import { Controller } from '@hotwired/stimulus';
import { elCreate } from '@dpsys/js-utils/el';
import { pause } from '@dpsys/js-utils/misc';


enum State 
{
    OPENING = 'OPENING',
    OPENED = 'OPENED',
    CLOSING = 'CLOSING',
    CLOSED = 'CLOSED',
};


export default class ModalWindow extends Controller<HTMLElement> 
{
    static override values = 
    {
        state: {type: String, default: State.CLOSED},
        openDurationMs: Number,
        closeDurationMs: Number,
        opener: String,
        clickOutsideIgnore: Array,
    }

    declare stateValue: State;
    declare openDurationMsValue: number;
    declare closeDurationMsValue: number;
    declare openerValue: string;
    declare clickOutsideIgnoreValue: string[];

    opener : HTMLElement|null = null;
    content : HTMLElement|null = null;
    closer : HTMLElement|null = null;

    override connect()
    {
        this.element.classList.add('modal_window');

        let el_content = this.element.querySelector('.modal_window_content') as HTMLElement;
        if (!el_content)
        {
            el_content = elCreate('div', {'class': 'modal_window_content'});
            this.element.appendChild(el_content);

            // Move user specified contents into content container 
            [...this.element.children].forEach( (el) =>
            {
                if (el.classList.contains('modal_window_content') || el.classList.contains('modal_window_closer')) {return;}
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
            document.addEventListener('click', this.handleOpenerClick);
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

    handleOpenerClick = (e : Event) : void =>
    {
        let el_opener = (e.target as HTMLElement).closest(this.openerValue) as HTMLElement; if (!el_opener) {return;}
        this.opener = el_opener;
        this.open();
    }
    
    open = async () : Promise<void> =>
	{        
		if (this.stateValue === State.OPENED) {return;}
					
		if ((this as any).openBeforeCallback instanceof Function)
        {
            console.warn('[StimulusModalWindow] ⚠️ openBeforeCallback() is deprecated and will be removed in the next minor release. Use openBefore() instead.');
            await (this as any).openBeforeCallback();
        }
        else if ((this as any).openBefore instanceof Function)
        {
            await (this as any).openBefore();
        }

		this.stateValue = State.OPENING;
        this.element.classList.add('opening');
		this.element.style.visibility = 'visible';
					
		setTimeout( async ()=> 
		{
			this.stateValue = State.OPENED;
            this.element.classList.add('opened');
            this.element.classList.remove('closed');   
            this.element.classList.remove('opening');

            if ((this as any).openAfterCallback instanceof Function)
            {
                console.warn('[StimulusModalWindow] ⚠️ openAfterCallback() is deprecated and will be removed in the next minor release. Use openAfter() instead.')
                await (this as any).openAfterCallback();
            }
            else if ((this as any).openAfter instanceof Function)
            {
                await (this as any).openAfter();
            }
		}
		, this.openDurationMsValue);
	}

    close = async () : Promise<void> =>
	{																		
		if ( this.stateValue === State.CLOSED ) {return;}					
				
        if ((this as any).closeBeforeCallback instanceof Function)
        {
            console.warn('[StimulusModalWindow] ⚠️ closeBeforeCallback() is deprecated and will be removed in the next minor release. Use closeBefore() instead.')
            await (this as any).closeBeforeCallback();
        }
        else if ((this as any).closeBefore instanceof Function)
        {
            await (this as any).closeBefore();
        }

		this.stateValue = State.CLOSING;
        this.element.classList.add('closing');
		
		await pause(this.closeDurationMsValue);
	
		this.stateValue = State.CLOSED;
        this.element.classList.add('closed');   
        this.element.classList.remove('opened');
        this.element.classList.remove('closing');
		this.element.style.visibility = '';

        if ((this as any).closeAfterCallback instanceof Function)
        {
            console.warn('[StimulusModalWindow] ⚠️ closeAfterCallback() is deprecated and will be removed in the next minor release. Use closeAfter() instead.')
            await (this as any).closeAfterCallback();
        }
        else if ((this as any).closeAfter instanceof Function)
        {
            await (this as any).closeAfter();
        }
	}

    clickOutside = (e : Event) : void =>
	{
        // Ignore closest element if specified
        var ignoreClosestFound = false;
        this.clickOutsideIgnoreValue.forEach( (ignoreCssSel)=>
        {						
            if ((e.target as HTMLElement).closest(ignoreCssSel)) {ignoreClosestFound = true;}
        });
        if (ignoreClosestFound) {return;}

		var isClickInside = this.element.contains(e.target as HTMLElement);
		
		if ( this.stateValue === State.OPENED  &&  !isClickInside ) {this.close();}
	}	
}
