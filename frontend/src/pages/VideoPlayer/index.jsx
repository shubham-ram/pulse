import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import useVideo from "./hooks/useVideo";
import VideoPlayerArea from "./components/VideoPlayerArea";
import VideoDetails from "./components/VideoDetails";
import DeleteVideoDialog from "./components/DeleteVideoDialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { video, loading, deleting, handleDelete } = useVideo(id);

  const streamUrl =
    video?.processingStatus === "ready"
      ? `${apiBaseUrl}/api/videos/${id}/stream?token=${encodeURIComponent(localStorage.getItem("token") || "")}`
      : null;

  const canDelete =
    user?.role === "admin" ||
    (user?.role === "editor" && video?.uploadedBy?._id === user?._id);

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div>
      <PageHeader title={video.title}>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {canDelete && (
          <DeleteVideoDialog
            videoTitle={video.title}
            deleting={deleting}
            onDelete={handleDelete}
          />
        )}
      </PageHeader>

      <VideoPlayerArea video={video} streamUrl={streamUrl} />
      <VideoDetails video={video} />
    </div>
  );
};

export default VideoPlayerPage;
