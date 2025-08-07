"use client";

import { useState } from "react";

// Interface-Definition - Interface definition
interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Upload-Handler - Upload handler
  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onUpload(data.url);
    } catch (error) {
      alert("Upload error occurred!");
    } finally {
      setUploading(false);
    }
  };

  // Drag-Handler - Drag handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Drop-Handler - Drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleUpload(files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 hover:border-blue-400"
      } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />

      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-slate-600 font-medium">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            />
          </svg>
          <label htmlFor="image-upload" className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-800 font-medium">
              Select image
            </span>
            <span className="text-slate-500"> or drag here</span>
          </label>
          <p className="text-xs text-slate-400 mt-2">
            PNG, JPG, GIF formats supported
          </p>
        </div>
      )}
    </div>
  );
}
