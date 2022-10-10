const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");
const { BLOCKS, MARKS } = require("@contentful/rich-text-types");
const template = document.createElement("template");

template.innerHTML = `
<style>
  .green {
    color: green;
  }

  .orange {
    color: orange;
  }

  .magenta {
    color: magenta;
  }

  .large-font {
    font-size: 23px;
  }

  .funny-font {
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-size: 20px;
  }
</style>
<div id="rich-text-container" class="rich-text"></div>
`;
class RichText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  container() {
    return this.shadowRoot.getElementById("rich-text-container");
  }

  json() {
    return JSON.parse(this.getAttribute("json"));
  }

  options() {
    return this.getAttribute("options")
      ? JSON.parse(this.getAttribute("options"))
      : {};
  }

  customNodes() {
    return this.options().customNodes || []
      .filter(({ node, tag }) => Object.values(BLOCKS).includes(node) && !!tag)
  }

  customMarks() {
    return this.options().customMarks || []
      .filter(({ mark, tag }) => Object.values(MARKS).includes(mark) && !!tag)

  }
  getVariant(variant) {
    return variant ? `variant="${variant}"` : "";
  }

  getClassNames(classNames = []) {
    return classNames.length
      ? `class="${classNames.toString()}"`
      : "";
  }

  nodeRenderers() {
    let nodes = {};
    this.customNodes()
      .map(({ node, tag, variant, classNames }) => {
        nodes[node] = (node, next) =>
          `<${tag} ${this.getVariant(variant)} ${this.getClassNames(
            classNames
          )}>${next(node.content)}</${tag}>`;
      });

    return nodes;
  }

  markRenderers() {
    let marks = {};
    this.customMarks()
      .map(({ mark, tag, variant, classNames }) => {
        marks[mark] = (text) =>
          `<${tag} ${this.getVariant(variant)} ${this.getClassNames(
            classNames
          )}>${text}</${tag}>`;
      });

    return marks;
  }

  buildOptions() {
    const renderMark = this.markRenderers();
    const renderNode = this.nodeRenderers();
    return renderMark || renderNode
      ? {
        ...(!!renderMark && { renderMark }),
        ...(!!renderNode && { renderNode }),
      }
      : undefined;
  }

  render() {
    const result = documentToHtmlString(this.json(), this.buildOptions());
    this.container().innerHTML = result;
  }
}
window.customElements.define("rich-text", RichText);
