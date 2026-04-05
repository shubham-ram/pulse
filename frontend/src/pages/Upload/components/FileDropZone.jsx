import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileVideo, X } from "lucide-react";

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];
const MAX_SIZE = 500 * 1024 * 1024; // 500MB

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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Video File</Label>
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors border-muted-foreground/25 hover:border-muted-foreground/50"
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <FileVideo className="h-8 w-8 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null, null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">Drag & drop or click to select</p>
            <p className="text-xs text-muted-foreground">
              MP4, WebM, MOV, AVI — max {formatSize(MAX_SIZE)}
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
