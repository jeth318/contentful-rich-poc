const { BLOCKS, MARKS } = require('@contentful/rich-text-types');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const template = document.createElement('template');
template.innerHTML = `
<style>
<style>
  .rich-text {
    font-family: sans-serif;
    background: #f4f6f7;
    width: 250px;
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 10px;
  }

</style>
<div id="rich-text-container" class="rich-text" />`;

class RichText extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const result = documentToHtmlString(JSON.parse(this.getAttribute('json')));
        const element = document.createElement("div");
        element.innerHTML = result
        document.body.appendChild(element)

    }
}
window.customElements.define('rich-text', RichText);