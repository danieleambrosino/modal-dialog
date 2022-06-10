class ModalDialog extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		const style = document.createElement('style');
		style.textContent = `
:host(:not([open])) {
	display: none;
}

.backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: grid;
	place-items: center;
}

.content {
	position: relative;
	background-color: white;
	border-radius: 5px;
	margin: 1rem;
	padding: 1rem;
	max-width: 768px;
	max-height: 90vh;
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
		this.shadowRoot.appendChild(style);

		this.backdrop = document.createElement('div');
		this.backdrop.setAttribute('role', 'presentation');
		this.backdrop.classList.add('backdrop');
		this.backdrop.addEventListener('click', this.closeOnBackdropClick.bind(this));
		this.shadowRoot.appendChild(this.backdrop);

		this.content = document.createElement('div');
		this.content.classList.add('content');
		this.backdrop.appendChild(this.content);

		this.content.appendChild(document.createElement('slot'));

		const closeButton = document.createElement('button');
		closeButton.setAttribute('type', 'button');
		closeButton.classList.add('close');
		closeButton.textContent = '×';
		closeButton.addEventListener('click', this.close.bind(this));
		this.content.appendChild(closeButton);

		if (this.hasAttribute('open')) {
			this.open();
		}
	}

	open() {
		this.toggleAttribute('open', true);
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.catchEscape);
	}

	close() {
		this.removeAttribute('open');
		document.body.style.removeProperty('overflow');
		document.removeEventListener('keydown', this.catchEscape);
	}

	closeOnBackdropClick(event) {
		if (event.target === this.backdrop) {
			this.close();
		}
	}

	catchEscape = ((event) => {
		if (event.key === 'Escape') {
			this.close();
		}
	}).bind(this);
}
customElements.define("modal-dialog", ModalDialog);
