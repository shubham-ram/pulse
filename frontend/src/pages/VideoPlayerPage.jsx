import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  Trash2,
  User,
  Calendar,
  Clock,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
} from "lucide-react";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Build a direct stream URL with token for native browser range requests
  const streamUrl =
    video?.processingStatus === "ready"
      ? `/api/videos/${id}/stream?token=${encodeURIComponent(localStorage.getItem("token") || "")}`
      : null;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data.data.video);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load video");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  const canDelete =
    user?.role === "admin" ||
    (user?.role === "editor" && video?.uploadedBy?._id === user?._id);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/videos/${id}`);
      toast.success("Video deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
      setDeleting(false);
    }
  };

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

  const isSafe = video.sensitivityStatus === "safe";
  const isFlagged = video.sensitivityStatus === "flagged";
  const isReady = video.processingStatus === "ready";

  return (
    <div>
      <PageHeader title={video.title}>
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {canDelete && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Video</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{video.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* Video Player */}
      <div className="mb-6 overflow-hidden rounded-lg bg-black">
        {isReady && streamUrl ? (
          <video
            className="aspect-video w-full"
            src={streamUrl}
            controls
            controlsList="nodownload"
          />
        ) : isReady && !streamUrl ? (
          <div className="flex aspect-video items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-white/70">
            {video.processingStatus === "failed" ? (
              <>
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-sm">Processing failed</p>
              </>
            ) : (
              <>
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm capitalize">
                  {video.processingStatus}...
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: description + categories */}
        <div className="md:col-span-2">
          {video.description && (
            <p className="mb-4 text-sm text-muted-foreground">{video.description}</p>
          )}

          {video.categoryIds?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {video.categoryIds.map((cat) => (
                <Badge key={cat._id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-sm font-semibold">Details</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{video.uploadedBy?.name || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              <span>{formatSize(video.fileSize)}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              {isSafe && <ShieldCheck className="h-4 w-4 text-green-500" />}
              {isFlagged && <ShieldAlert className="h-4 w-4 text-red-500" />}
              {!isSafe && !isFlagged && <ShieldCheck className="h-4 w-4 text-muted-foreground" />}
              <Badge
                variant="outline"
                className={cn(
                  "border-0",
                  isSafe && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  isFlagged && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {video.sensitivityStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
