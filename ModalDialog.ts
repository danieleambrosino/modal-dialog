class ModalDialog extends HTMLElement {
	#backdrop: HTMLDivElement;

	constructor() {
		super();
		if (!this.hasAttribute('open')) {
			this.ariaHidden = 'true';
		}
		const shadowRoot = this.attachShadow({ mode: "closed" });
		const style = document.createElement('style');
		style.textContent = `
:host {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
}
:host(:not([open])) {
	display: none;
}
.backdrop {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: grid;
	place-items: center;
	padding: 1rem;
}
.content {
	position: relative;
	background-color: white;
	border-radius: 5px;
	padding: 1rem;
	box-sizing: border-box;
	max-width: 768px;
	max-height: 100%;
	overflow-y: auto;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
button.close {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 2.5em;
	border: none;
	background: none;
	cursor: pointer;
	color: grey;
}
button.close:hover {
	color: black;
}
`;

		this.#backdrop = document.createElement('div');
		this.#backdrop.classList.add('backdrop');
		this.#backdrop.addEventListener('click', this.#closeOnBackdropClick.bind(this));

		const content = document.createElement('div');
		content.classList.add('content');
		content.setAttribute('role', 'dialog');
		content.ariaModal = 'true';
		this.#backdrop.appendChild(content);

		content.appendChild(document.createElement('slot'));

		const closeButton = document.createElement('button');
		closeButton.setAttribute('type', 'button');
		closeButton.classList.add('close');
		closeButton.textContent = '×';
		closeButton.addEventListener('click', this.close.bind(this));
		content.appendChild(closeButton);

		shadowRoot.appendChild(style);
		shadowRoot.appendChild(this.#backdrop);
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
