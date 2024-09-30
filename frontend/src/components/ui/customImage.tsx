import { Image } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/react';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-svg-content': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-svg-content'),
        renderHTML: (attributes) => {
          const { src, 'data-svg-content': dataSvgContent } = attributes;
          const attrs: Record<string, string> = { src };

          if (dataSvgContent) {
            attrs['data-svg-content'] = dataSvgContent;
          }

          return attrs;
        },
      },
    };
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
