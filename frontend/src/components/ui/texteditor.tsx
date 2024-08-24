"use client";
import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Code,
  Link as LinkIcon,
  Indent,
} from "lucide-react";
import { AiOutlinePicture, AiOutlineVideoCamera } from "react-icons/ai";
import YouTube from "@tiptap/extension-youtube";

interface RichTextEditorProps {
  onChange: (content: string) => void;
  disabled?: boolean;
  value?: string;
}

export default function RichTextEditor({
  onChange,
  value = "<p>Introduce your story ...</p>",
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
      Placeholder.configure({
        placeholder: "Introduce your story ...",
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-blue-500 underline",
        },
      }),
      Underline,
      YouTube,
    ],
    editable: !disabled,
    content: value,
  });

  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        const content = editor.getHTML();
        onChange(content);
      });
    }

    return () => {
      editor?.off("update");
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
          disabled ? "cursor-not-allowed" : "cursor-text"
        }`}
        onClick={handleEditorClick}
      >
        <EditorContent
          editor={editor}
          className={`text-base sm:text-lg text-gray-700 h-full ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        />
      </div>
    </div>
  );
}

interface ToolbarProps {
  editor: Editor | null;
}

function Toolbar({ editor }: ToolbarProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result?.toString();
          if (base64 && editor) {
            editor.chain().focus().setImage({ src: base64 }).run();
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
          .insertContent("\n    ")
          .run();

        // Move the cursor to the end of the content
        editor.commands.focus("end");

        setVideoUrl("");
      } else {
        alert("Invalid YouTube URL");
      }
    }
  }, [videoUrl, editor]);

  const insertLink = useCallback(() => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .insertContent(linkUrl) // Ensure the link is inserted with visible text
        .run();
      setLinkUrl("");
    }
  }, [linkUrl, editor]);

  const addIndentation = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent("    ").run(); // Insert a tab or 4 spaces
    }
  }, [editor]);

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
          editor.isActive("bold") ? "bg-gray-300" : ""
        }`}
      >
        <Bold className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive("italic") ? "bg-gray-300" : ""
        }`}
      >
        <Italic className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive("underline") ? "bg-gray-300" : ""
        }`}
      >
        <UnderlineIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 sm:p-2 rounded-full ${
          editor.isActive("codeBlock") ? "bg-gray-300" : ""
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
      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={insertVideo}
          disabled={!videoUrl}
          className="p-1 sm:p-2 rounded-full bg-gray-300 hover:bg-[#F1F5F9]"
        >
          <AiOutlineVideoCamera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        </Button>
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border border-gray-300 p-1 sm:p-2 rounded-lg focus:outline-none focus:border-gray-400 text-sm sm:text-base flex-grow"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={insertLink}
          disabled={!linkUrl}
          className="p-1 sm:p-2 rounded-full bg-gray-300 hover:bg-[#F1F5F9]"
        >
          <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        </Button>
        <input
          type="text"
          placeholder="Link URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="border border-gray-300 p-1 sm:p-2 rounded-lg focus:outline-none focus:border-gray-400 text-sm sm:text-base flex-grow"
        />
      </div>
    </div>
  );
}
