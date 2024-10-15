'use client';
import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Link as LinkIcon,
  Indent,
} from 'lucide-react';
import { AiOutlinePicture, AiOutlineVideoCamera } from 'react-icons/ai';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [videoPopupOpen, setVideoPopupOpen] = useState(false);
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const fileType = file.type;

        if (fileType === 'image/gif') {
          alert('GIF images are not allowed. Please upload a different image.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (editor) {
            const base64 = reader.result?.toString();
            if (base64) {
              editor.chain().focus().setImage({ src: base64 }).run();
            }
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [editor]
  );

  const insertVideo = useCallback(() => {
    if (videoUrl && editor) {
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        editor
          .chain()
          .focus()
          .setYoutubeVideo({ src: `https://www.youtube.com/embed/${videoId}` })
          .run();

        editor.commands.focus('end');

        setVideoUrl('');
        setVideoPopupOpen(false);
      } else {
        alert('Invalid YouTube URL');
      }
    }
  }, [videoUrl, editor]);

  const insertLink = useCallback(() => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setLinkPopupOpen(false);
    }
  }, [linkUrl, editor]);

  const addIndentation = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent('    ').run(); // Insert a tab or 4 spaces
    }
  }, [editor]);

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-200 rounded-lg shadow-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
      >
        <Bold className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
      >
        <Italic className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive('underline') ? 'bg-gray-300' : ''
        }`}
      >
        <UnderlineIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive('codeBlock') ? 'bg-gray-300' : ''
        }`}
      >
        <Code className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={addIndentation}
        className="p-1 sm:p-2 rounded-full bg-gray-300 hover:bg-[#F1F5F9]"
      >
        <Indent className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <label className="cursor-pointer p-1 sm:p-2 rounded-full hover:bg-[#F1F5F9]">
        <AiOutlinePicture className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setVideoPopupOpen(true)}
        className="p-1 sm:p-2 rounded-full bg-gray-300 hover:bg-[#F1F5F9]"
      >
        <AiOutlineVideoCamera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLinkPopupOpen(true)}
        className="p-1 sm:p-2 rounded-full bg-gray-300 hover:bg-[#F1F5F9]"
      >
        <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>

      {/* Popup para el video */}
      {videoPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">Insert Video URL</h2>
            <input
              type="text"
              placeholder="YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full mb-4"
            />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="mr-2 rounded-full bg-gray-100 hover:bg-gray-100/80"
                onClick={() => setVideoPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={insertVideo}
                className="bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 px-4 py-2"
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup para el link */}
      {linkPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">Insert Link</h2>
            <input
              type="text"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full mb-4"
            />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="mr-2 bg-gray-100 hover:bg-gray-100/80 rounded-full"
                onClick={() => setLinkPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={insertLink}
                className="bg-[#000916] hover:bg-[#000916]/80 text-white rounded-full px-4 py-2"
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
