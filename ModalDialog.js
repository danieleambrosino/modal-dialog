class ModalDialog extends HTMLElement {
	#backdrop;
	#content;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
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
	font-size: 1.5rem;
	padding: 0.5rem;
	border: none;
	background: none;
	cursor: pointer;
}
`;

		this.#backdrop = document.createElement('div');
		this.#backdrop.setAttribute('role', 'presentation');
		this.#backdrop.classList.add('backdrop');
		this.#backdrop.addEventListener('click', this.#closeOnBackdropClick.bind(this));

		this.#content = document.createElement('div');
		this.#content.classList.add('content');
		this.#backdrop.appendChild(this.#content);

		this.#content.appendChild(document.createElement('slot'));

		const closeButton = document.createElement('button');
		closeButton.setAttribute('type', 'button');
		closeButton.classList.add('close');
		closeButton.textContent = '×';
		closeButton.addEventListener('click', this.close.bind(this));
		this.#content.appendChild(closeButton);

		this.shadowRoot.appendChild(style);
		this.shadowRoot.appendChild(this.#backdrop);
	}

	open() {
		this.toggleAttribute('open', true);
	}

	close() {
		this.removeAttribute('open');
	}

	/**
	 * @param {MouseEvent} event
	 */
	#closeOnBackdropClick(event) {
		if (event.target === this.#backdrop) {
			this.close();
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	#catchEscape = ((event) => {
		if (event.key === 'Escape') {
			this.close();
		}
	}).bind(this);

	/**
	 * @param {string} name
	 * @param {?string} oldValue 
	 * @param {?string} newValue 
	 * @returns {void}
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name !== 'open') return;
		if (newValue !== null) {
			this.#doOpen();
		} else {
			this.#doClose();
		}
	}

	#doOpen() {
		this.#closeAllPreviouslyOpened();
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.#catchEscape);
	}

	#closeAllPreviouslyOpened() {
		/**
		 * @type {ModalDialog[]}
		 */
		const modals = Array.from(document.querySelectorAll('modal-dialog[open]'));
		modals
			.filter((modal) => modal !== this)
			.forEach((modal) => {
				modal.close();
			});
	}

	#doClose() {
		document.body.style.removeProperty('overflow');
		document.removeEventListener('keydown', this.#catchEscape);
	}

	static get observedAttributes() { return ['open']; }
}
customElements.define("modal-dialog", ModalDialog);
