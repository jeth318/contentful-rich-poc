const { BLOCKS, MARKS } = require('@contentful/rich-text-types');
const { richRenderer } = require("./richRenderer");
require("./web-rich-text.js");
const doc = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'hr',
      value: 'Hello',
      marks: [],
      data: {}
    }, {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
          data: {}
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
          data: {}
        },
      ],
    },
  ]
};


const customMarks = {
  [MARKS.BOLD]: text => `<b>${text}<b>`
};
const customBlocks = {
  [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`
};

const opt = {
  customNodes: {
    paragraph: {
      variant: "big",
      tag: "main"
    }
  }
}
//richRenderer(doc, customBlocks, customMarks)

// -> <custom-paragraph><custom-bold>Hello</custom-bold><u> world!</u></custom-paragraph>