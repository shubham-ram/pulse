import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import socket from "@/services/socket";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileVideo, X, CheckCircle2, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const MAX_SIZE = 500 * 1024 * 1024; // 500MB

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Processing state (after upload completes)
  const [processingState, setProcessingState] = useState(null); // null | { stage, progress } | "complete" | "error"
  const [processingResult, setProcessingResult] = useState(null);

  // Track whether we're actively listening for processing events
  const [listening, setListening] = useState(false);

  // Socket listeners for processing progress
  useEffect(() => {
    if (!listening) return;

    socket.connect();
    socket.emit("join", user._id);

    const onProgress = ({ stage, progress }) => {
      setProcessingState({ stage, progress });
    };

    const onComplete = ({ videoId, processingStatus, sensitivityStatus }) => {
      setProcessingState("complete");
      setProcessingResult({ videoId, processingStatus, sensitivityStatus });
      setListening(false);
      toast.success("Video processing complete!");
    };

    const onError = ({ message }) => {
      setProcessingState("error");
      setListening(false);
      toast.error(message || "Processing failed");
    };

    socket.on("processing-progress", onProgress);
    socket.on("processing-complete", onComplete);
    socket.on("processing-error", onError);

    return () => {
      socket.off("processing-progress", onProgress);
      socket.off("processing-complete", onComplete);
      socket.off("processing-error", onError);
      socket.disconnect();
    };
  }, [listening, user._id]);

  const validateFile = useCallback((f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Unsupported file type. Please upload MP4, WebM, MOV, or AVI.");
      return false;
    }
    if (f.size > MAX_SIZE) {
      toast.error(`File too large. Maximum size is ${formatSize(MAX_SIZE)}.`);
      return false;
    }
    return true;
  }, []);

  const handleFileSelect = (f) => {
    if (f && validateFile(f)) {
      setFile(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("video", file);

    try {
      await api.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(pct);
        },
      });
      toast.success("Upload complete — processing started");
      setUploading(false);
      // Start listening for processing events
      setProcessingState({ stage: "starting", progress: 0 });
      setListening(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setUploading(false);
    }
  };

  const isProcessing = processingState && processingState !== "complete" && processingState !== "error";

  // Show processing / result UI after upload
  if (processingState) {
    return (
      <div>
        <PageHeader title="Upload Video" description="Processing your video" />
        <Card className="mx-auto max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            {isProcessing && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium capitalize">
                  Stage: {processingState.stage}
                </div>
                <Progress value={processingState.progress} className="w-full">
                  <ProgressLabel>Processing</ProgressLabel>
                  <ProgressValue />
                </Progress>
                <p className="text-xs text-muted-foreground">
                  Please wait while your video is being processed...
                </p>
              </>
            )}

            {processingState === "complete" && processingResult && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-lg font-semibold">Processing Complete</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{processingResult.processingStatus}</Badge>
                  <Badge variant="outline">{processingResult.sensitivityStatus}</Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => navigate(`/videos/${processingResult.videoId}`)}>
                    View Video
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setProcessingState(null);
                    setProcessingResult(null);
                    setTitle("");
                    setDescription("");
                    setFile(null);
                    setUploadProgress(0);
                  }}>
                    Upload Another
                  </Button>
                </div>
              </>
            )}

            {processingState === "error" && (
              <>
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-semibold">Processing Failed</p>
                <p className="text-sm text-muted-foreground">
                  Something went wrong while processing your video.
                </p>
                <Button variant="outline" onClick={() => {
                  setProcessingState(null);
                  setProcessingResult(null);
                }}>
                  Try Again
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Upload Video" description="Upload a video for processing and analysis" />

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>Fill in the details and select a video file</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* File drop zone */}
            <div className="flex flex-col gap-2">
              <Label>Video File</Label>
              <div
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center gap-3">
                    <FileVideo className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                    </div>
                    {!uploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">
                      Drag & drop or click to select
                    </p>
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

            {/* Upload progress */}
            {uploading && (
              <Progress value={uploadProgress} className="w-full">
                <ProgressLabel>Uploading</ProgressLabel>
                <ProgressValue />
              </Progress>
            )}

            <Button type="submit" disabled={uploading} className="gap-2">
              {uploading ? (
                `Uploading... ${uploadProgress}%`
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
