import { Controller } from '@hotwired/stimulus';
import { elCreate } from '@dpsys/js-utils/el';
import { pause } from '@dpsys/js-utils/misc';
import './style.css';   // TODO: Needs to be manually added to index.mjs as: "import './index.css';" (https://github.com/egoist/tsup/issues/1296)

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
    
    protected async openBeforeCallback(): Promise<void> {}
    protected async openAfterCallback(): Promise<void> {}
    protected async closeBeforeCallback(): Promise<void> {}
    protected async closeAfterCallback(): Promise<void> {}


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

    openerCallback = (e : Event) : void =>
    {
        let el_opener = (e.target as HTMLElement).closest(this.openerValue) as HTMLElement; if (!el_opener) {return;}
        this.opener = el_opener;
        this.open();
    }
    
    open = async () : Promise<void> =>
	{        
		if (this.stateValue === State.OPENED) {return;}
					
		await this.openBeforeCallback();

		this.stateValue = State.OPENING;
        this.element.classList.add('opening');
		this.element.style.visibility = 'visible';
					
		setTimeout( async ()=> 
		{
			this.stateValue = State.OPENED;
            this.element.classList.add('opened');
            this.element.classList.remove('closed');   
            this.element.classList.remove('opening');

            await this.openAfterCallback();
		}
		, this.openDurationMsValue);
	}

    close = async () : Promise<void> =>
	{																		
		if ( this.stateValue === State.CLOSED ) {return;}					
				
        await this.closeBeforeCallback();

		this.stateValue = State.CLOSING;
        this.element.classList.add('closing');
		
		await pause(this.closeDurationMsValue);
	
		this.stateValue = State.CLOSED;
        this.element.classList.add('closed');   
        this.element.classList.remove('opened');
        this.element.classList.remove('closing');
		this.element.style.visibility = '';

        await this.closeAfterCallback();
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
