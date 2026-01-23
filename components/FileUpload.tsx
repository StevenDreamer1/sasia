"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileVideo, X, CheckCircle } from "lucide-react";
// Remove axios if you haven't installed it yet, or keep it if you did
// 
import axios from "axios";

// Define the Props type explicitly
interface FileUploadProps {
  onUploadComplete: (fileName: string) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    handleUpload(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (currentFile: File) => {
    setUploading(true);
    
    // Simulating upload for now (Remove this setTimeout and uncomment axios for real backend)
    setTimeout(() => {
        setUploading(false);
        onUploadComplete(currentFile.name);
        setFile(null);
        setProgress(0);
    }, 2000);

    // REAL BACKEND CODE (Uncomment when API is ready)
    /*
    const formData = new FormData();
    formData.append("file", currentFile);
    try {
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });
      onUploadComplete(currentFile.name);
    } catch (error) {
      console.error(error);
    }
    */
  };

  return (
    <div className="p-4 border-b border-slate-100">
      {!uploading ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
            <UploadCloud size={20} />
          </div>
          <p className="text-xs text-center font-medium text-slate-600">
            {isDragActive ? "Drop video here..." : "Click or Drag to Upload"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                <FileVideo size={16} />
              </div>
              <p className="text-xs font-bold text-slate-700">{file?.name}</p>
            </div>
            <p className="text-xs text-indigo-600 font-bold">Uploading...</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 w-1/2 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}