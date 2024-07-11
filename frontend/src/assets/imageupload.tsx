"use client";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  setImage: (image: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImage }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const result = e.target.result as string;
          setImage(result);
          setUploadedImage(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: uploadedImage !== null, // Deshabilitar el área de carga si hay una imagen cargada
  });

  const removeImage = () => {
    setUploadedImage(null);
    setImage("");
  };

  return (
    <div>
      <AnimatePresence>
        {uploadedImage ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="rounded-lg w-full h-auto"
            />
            <button
              className="absolute top-2 right-2 p-1 bg-transparent text-white rounded-full"
              onClick={removeImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 cursor-pointer text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M6.225 5.225a.75.75 0 011.06 0L12 9.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 11l4.715 4.715a.75.75 0 11-1.06 1.06L12 12.06l-4.715 4.715a.75.75 0 01-1.06-1.06L10.94 11 6.225 6.285a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center"
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <FaUpload className="text-black w-10 h-10 mx-auto" />
              <p className="text-gray-500">
                Drag and drop a file here, or click to select a file
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
