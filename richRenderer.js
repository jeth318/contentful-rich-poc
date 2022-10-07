const { BLOCKS, MARKS } = require('@contentful/rich-text-types');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

export function richRenderer(richDoc, customBlocks, customMarks) {
    const config = {
        renderMark: customMarks,
        renderNode: customBlocks
    }
    const result = documentToHtmlString(richDoc, config);
    const element = document.createElement("div");
    element.innerHTML = result
    document.body.appendChild(element)
}