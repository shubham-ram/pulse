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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-border/50 dark:hover:shadow-primary/10"
      onClick={() => navigate(`/videos/${video._id}`)}
    >
      {/* Thumbnail placeholder */}
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-colors group-hover:from-indigo-500/10 group-hover:to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/10">
        <Video className="h-10 w-10 text-muted-foreground/40 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/60" />
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-base transition-colors group-hover:text-primary">{video.title}</CardTitle>
        {video.description && (
          <CardDescription className="line-clamp-2 mt-1">
            {video.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4 pt-0">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={cn("border-0 shadow-none font-medium", processing.className)}
          >
            {processing.label}
          </Badge>
          <Badge
            variant="secondary"
            className={cn("border-0 shadow-none font-medium", sensitivity.className)}
          >
            {sensitivity.label}
          </Badge>
        </div>

        {/* Meta */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="h-3.5 w-3.5" />
            {video.uploadedBy?.name || "Unknown"}
          </span>
          <span className="flex items-center gap-1.5 opacity-75">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(video.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
