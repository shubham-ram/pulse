import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Video, Clock, User } from "lucide-react";

const processingConfig = {
  uploading: {
    label: "Uploading",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  processing: {
    label: "Processing",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  analyzed: {
    label: "Analyzed",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  ready: {
    label: "Ready",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const sensitivityConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  },
  safe: {
    label: "Safe",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  flagged: {
    label: "Flagged",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const processing =
    processingConfig[video.processingStatus] || processingConfig.processing;
  const sensitivity =
    sensitivityConfig[video.sensitivityStatus] || sensitivityConfig.pending;

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/videos/${video._id}`)}
    >
      {/* Thumbnail placeholder */}
      <div className="flex h-36 items-center justify-center rounded-t-lg bg-muted">
        <Video className="h-10 w-10 text-muted-foreground/50" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base">{video.title}</CardTitle>
        {video.description && (
          <CardDescription className="line-clamp-2">
            {video.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className={cn("border-0", processing.className)}
          >
            {processing.label}
          </Badge>
          <Badge
            variant="outline"
            className={cn("border-0", sensitivity.className)}
          >
            {sensitivity.label}
          </Badge>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {video.uploadedBy?.name || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(video.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
