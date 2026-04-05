import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  User,
  Calendar,
  Clock,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
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

const VideoDetails = ({ video }) => {
  const isSafe = video.sensitivityStatus === "safe";
  const isFlagged = video.sensitivityStatus === "flagged";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Left: description + categories */}
      <div className="md:col-span-2">
        {video.description && (
          <p className="mb-4 text-sm text-muted-foreground">
            {video.description}
          </p>
        )}

        {video.categoryIds?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.categoryIds.map((cat) => (
              <Badge key={cat._id} variant="secondary" className="hover:bg-secondary/80 transition-colors cursor-default">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right: details */}
      <div className="h-fit rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="mb-4 text-base font-semibold tracking-tight">Metadata</h3>
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
            {!isSafe && !isFlagged && (
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            )}
            <Badge
              variant="outline"
              className={cn(
                "border-0 shadow-none font-medium ml-auto",
                isSafe &&
                  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                isFlagged &&
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              )}
            >
              {video.sensitivityStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
