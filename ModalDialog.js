class ModalDialog extends HTMLElement{#e;constructor(){super(),this.hasAttribute("open")||(this.ariaHidden="true");const e=this.attachShadow({mode:"closed"}),o=document.createElement("style");o.textContent=`
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
`,this.#e=document.createElement("div"),this.#e.classList.add("backdrop"),this.#e.addEventListener("click",this.#s.bind(this));const t=document.createElement("div");t.classList.add("content"),t.setAttribute("role","dialog"),t.ariaModal="true",this.#e.appendChild(t),t.appendChild(document.createElement("slot"));const i=document.createElement("button");i.setAttribute("type","button"),i.classList.add("close"),i.textContent="\xD7",i.addEventListener("click",this.close.bind(this)),t.appendChild(i),e.appendChild(o),e.appendChild(this.#e)}open(){this.toggleAttribute("open",!0)}close(){this.removeAttribute("open")}attributeChangedCallback(e,o,t){e==="open"&&(t!==null?this.#o():this.#i())}static get observedAttributes(){return["open"]}#o(){this.#n(),this.ariaHidden="false",document.body.style.overflow="hidden",document.addEventListener("keydown",this.#t)}#i(){this.ariaHidden="true",document.body.style.removeProperty("overflow"),document.removeEventListener("keydown",this.#t)}#n(){Array.from(document.querySelectorAll("modal-dialog[open]")).filter(o=>o!==this).forEach(o=>{o.close()})}#s(e){e.target===this.#e&&this.close()}#t=(e=>{e.key==="Escape"&&this.close()}).bind(this)}customElements.define("modal-dialog",ModalDialog);
