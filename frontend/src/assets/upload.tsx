"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";

const Upload = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className="space-y-4 p-4 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center bg-transparent text-black max-w-xs mx-auto md:max-w-md lg:max-w-lg mt-4"
    >
      <input {...getInputProps()} />
      <FaUpload className="text-black w-8 h-8 md:w-10 md:h-10" />
      <p className="text-gray-500 text-center">Drag and drop files here</p>
      <button
        className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
        onClick={() => {
          const inputElement = document.querySelector('input[type="file"]');
          if (inputElement instanceof HTMLInputElement) {
            inputElement.click();
          }
        }}
      >
        Select files
      </button>
    </div>
  );
};

export default Upload;
