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
      const content = editorRef.current.getContent();
      onChange(content);
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
          "image media | removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        image_title: true,
        automatic_uploads: true,
        file_picker_types: "image media",
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute(
            "accept",
            meta.filetype === "image" ? "image/*" : "video/*"
          );

          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result?.toString();
                if (base64) {
                  const id = "blobid" + new Date().getTime();
                  const blobCache = editorRef.current?.editorUpload.blobCache;
                  const blobInfo = blobCache?.create(id, file, base64.split(",")[1]);
                  blobCache?.add(blobInfo as any);

                  cb(blobInfo?.blobUri() || "", { title: file.name });
                }
              };
              reader.readAsDataURL(file);
            }
          };

          input.click();
        },
      }}
      onChange={handleEditorChange}
    />
  );
};

export default CustomEditor;
