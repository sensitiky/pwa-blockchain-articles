import { Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/react';

const CustomImage = Node.create({
  name: 'customImage',

  group: 'inline',

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      'data-svg-content': {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, 'data-svg-content': dataSvgContent } = HTMLAttributes;
    const attrs: Record<string, string> = { src };

    if (dataSvgContent) {
      attrs['data-svg-content'] = dataSvgContent;
    }

    return ['img', mergeAttributes(this.options.HTMLAttributes, attrs)];
  },

  addNodeView() {
    return ({ node }) => {
      const { src, 'data-svg-content': dataSvgContent } = node.attrs;

      if (src && src.startsWith('data:image/')) {
        // Handle base64-encoded images
        return (
          <img
            src={src}
            dangerouslySetInnerHTML={{ __html: dataSvgContent || '' }}
          />
        );
      } else {
        // Handle regular images
        return <img src={src} />;
      }
    };
  },
});

export default CustomImage;
