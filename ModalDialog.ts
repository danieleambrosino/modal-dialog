class ModalDialog extends HTMLElement {
	#backdrop: HTMLDivElement;

	constructor() {
		super();
		if (!this.hasAttribute('open')) {
			this.ariaHidden = 'true';
		}
		const shadowRoot = this.attachShadow({ mode: "closed" });
		shadowRoot.innerHTML = `<style>:host{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999}:host(:not([open])){display:none}.backdrop{box-sizing:border-box;width:100%;height:100%;background-color:rgba(0,0,0,.5);display:grid;place-items:center;padding:1rem}.content{position:relative;background-color:#fff;border-radius:5px;padding:1rem;box-sizing:border-box;max-width:768px;max-height:100%;overflow-y:auto;box-shadow:0 0 10px rgba(0,0,0,.5)}button.close{position:absolute;top:0;right:0;font-size:2.5em;border:none;background:0 0;cursor:pointer;color:grey}button.close:hover{color:#000}</style><div class=backdrop><div class=content aria-modal=true role=dialog><slot></slot><button aria-label=Close class=close type=button>×</button></div></div>`;
		this.#backdrop = shadowRoot.querySelector('.backdrop') as HTMLDivElement;
		this.#backdrop.addEventListener('click', this.#closeOnBackdropClick.bind(this));

		const closeButton = shadowRoot.querySelector('button.close') as HTMLButtonElement;
		closeButton.addEventListener('click', this.close.bind(this));
	}

	open() {
		this.toggleAttribute('open', true);
	}

	close() {
		this.removeAttribute('open');
	}

	attributeChangedCallback(name: string, oldValue?: string, newValue?: string): void {
		if (name !== 'open') return;
		if (newValue !== null) {
			this.#doOpen();
		} else {
			this.#doClose();
		}
	}
	static get observedAttributes() { return ['open']; }

	#doOpen(): void {
		this.#closeAllPreviouslyOpened();
		this.ariaHidden = 'false';
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.#catchEscape);
	}

	#doClose(): void {
		this.ariaHidden = 'true';
		document.body.style.removeProperty('overflow');
		document.removeEventListener('keydown', this.#catchEscape);
	}

	#closeAllPreviouslyOpened() {
		const modals: ModalDialog[] = Array.from(document.querySelectorAll('modal-dialog[open]'));
		modals
			.filter((modal) => modal !== this)
			.forEach((modal) => {
				modal.close();
			});
	}

	#closeOnBackdropClick(event: MouseEvent) {
		if (event.target === this.#backdrop) {
			this.close();
		}
	}

	#catchEscape = ((event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.close();
		}
	}).bind(this);
}
customElements.define("modal-dialog", ModalDialog);
