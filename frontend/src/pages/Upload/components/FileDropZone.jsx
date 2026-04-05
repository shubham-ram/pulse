import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileVideo, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (f) => {
  if (!ACCEPTED_TYPES.includes(f.type)) {
    return "Unsupported file type. Please upload MP4, WebM, MOV, or AVI.";
  }
  if (f.size > MAX_SIZE) {
    return `File too large. Maximum size is ${formatSize(MAX_SIZE)}.`;
  }
  return null;
};

const FileDropZone = ({ file, onFileChange, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (f) => {
    if (!f) return;
    const error = validateFile(f);
    if (error) {
      onFileChange(null, error);
      return;
    }
    onFileChange(f, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Video File</Label>
      <div
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-300",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10",
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileVideo className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatSize(file.size)}
              </p>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="col-span-1 ml-4 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null, null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10">
              <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-base font-medium">
              {isDragActive
                ? "Drop video here"
                : "Drag & drop or click to select"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-center">
              Supports MP4, WebM, MOV, AVI <br /> Up to {formatSize(MAX_SIZE)}
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
    </div>
  );
};

export default FileDropZone;
