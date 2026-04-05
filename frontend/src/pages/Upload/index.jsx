import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import getField from "@/form/getField";
import useUploadForm from "./hooks/useUploadForm";
import useVideoProcessing from "./hooks/useVideoProcessing";
import uploadControls from "./config/controls";
import FileDropZone from "./components/FileDropZone";
import ProcessingStatus from "./components/ProcessingStatus";

const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, errors } = useUploadForm();
  const { processingState, processingResult, startListening, resetProcessing } =
    useVideoProcessing(user._id);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (f, error) => {
    if (error) {
      toast.error(error);
      return;
    }
    setFile(f);
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
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
      startListening();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setUploading(false);
    }
  };

  if (processingState) {
    return (
      <ProcessingStatus
        processingState={processingState}
        processingResult={processingResult}
        onViewVideo={() => navigate(`/videos/${processingResult.videoId}`)}
        onUploadAnother={() => {
          resetProcessing();
          reset();
          setFile(null);
          setUploadProgress(0);
        }}
        onTryAgain={resetProcessing}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Upload Video"
        description="Upload a video for processing and analysis"
      />

      <Card className="mx-auto max-w-2xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>
            Fill in the details and select a video file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {uploadControls.map((config) => {
              const Element = getField(config.type);
              return (
                <Element
                  key={config.name}
                  {...config}
                  control={control}
                  errors={errors}
                  disabled={uploading}
                />
              );
            })}

            <FileDropZone
              file={file}
              onFileChange={handleFileChange}
              disabled={uploading}
            />

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
