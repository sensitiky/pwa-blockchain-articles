'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import YouTube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import CustomImage from './customImage';
import Toolbar from './toolbar';

interface RichTextEditorProps {
  onChange: (content: string) => void;
  disabled?: boolean;
  value?: string;
}

export default function RichTextEditor({
  onChange,
  value = '<p>Introduce your story ...</p>',
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
      }),
      BulletList,
      ListItem,
      Image,
      CustomImage,
      Placeholder.configure({
        placeholder: 'Introduce your story ...',
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-blue-500 underline',
        },
      }),
      Underline,
      YouTube.configure({
        HTMLAttributes: {
          class: 'youtube-iframe',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        const content = editor.getHTML();
        onChange(content);
      });
    }

    return () => {
      editor?.off('update');
    };
  }, [editor, onChange]);

  const handleEditorClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  return (
    <div className="mx-auto mt-4 sm:mt-8 px-4 sm:px-0 max-w-3xl">
      <Toolbar editor={editor} />
      <div
        className={`bg-gray-100 border border-gray-300 rounded-xl p-3 sm:p-6 mt-4 h-[calc(100vh-200px)] cursor-text overflow-y-auto ${
          disabled ? 'cursor-not-allowed' : 'cursor-text'
        }`}
        onClick={handleEditorClick}
      >
        <EditorContent
          editor={editor}
          className={`text-base sm:text-lg text-gray-700 h-full ${
            disabled ? 'pointer-events-none opacity-60' : ''
          } editor-content`}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">HTML Output:</h3>
        <pre className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          {editor?.getHTML()}
        </pre>
      </div>
    </div>
  );
}
