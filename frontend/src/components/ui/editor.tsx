"use client";

import { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

interface CustomEditorProps {
  onChange: (content: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ onChange }) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.on("change", handleEditorChange);
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.off("change", handleEditorChange);
      }
    };
  }, []);

  return (
    <Editor
      apiKey="y0at2od14wcly7jbdqpjh9vy4b12oxnf64jkpq1cu7v13k65"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      init={{
        height: 500,
        menubar: false,
        placeholder: "Introduce your story",
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onChange={handleEditorChange}
    />
  );
};

export default CustomEditor;
