class ModalDialog extends HTMLElement{#e;#t;constructor(){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=`
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
`,this.#e=document.createElement("div"),this.#e.setAttribute("role","presentation"),this.#e.classList.add("backdrop"),this.#e.addEventListener("click",this.#d.bind(this)),this.#t=document.createElement("div"),this.#t.classList.add("content"),this.#e.appendChild(this.#t),this.#t.appendChild(document.createElement("slot"));const e=document.createElement("button");e.setAttribute("type","button"),e.classList.add("close"),e.textContent="\xD7",e.addEventListener("click",this.close.bind(this)),this.#t.appendChild(e),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(this.#e)}open(){this.toggleAttribute("open",!0)}close(){this.removeAttribute("open")}attributeChangedCallback(t,e,o){t==="open"&&(o!==null?this.#i():this.#s())}static get observedAttributes(){return["open"]}#i(){this.#n(),document.body.style.overflow="hidden",document.addEventListener("keydown",this.#o)}#s(){document.body.style.removeProperty("overflow"),document.removeEventListener("keydown",this.#o)}#n(){Array.from(document.querySelectorAll("modal-dialog[open]")).filter(e=>e!==this).forEach(e=>{e.close()})}#d(t){t.target===this.#e&&this.close()}#o=(t=>{t.key==="Escape"&&this.close()}).bind(this)}customElements.define("modal-dialog",ModalDialog);
