import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import PageHeader from "@/components/layout/PageHeader";
import VideoCard from "@/components/video/VideoCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Upload, VideoOff } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingFilter, setProcessingFilter] = useState("all");
  const [sensitivityFilter, setSensitivityFilter] = useState("all");

  const canUpload = user?.role === "admin" || user?.role === "editor";

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (processingFilter !== "all")
        params.processingStatus = processingFilter;
      if (sensitivityFilter !== "all")
        params.sensitivityStatus = sensitivityFilter;

      const res = await api.get("/videos", { params });
      setVideos(res.data.data.videos);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [processingFilter, sensitivityFilter]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div>
      <PageHeader
        title="Video Library"
        description="Browse and manage your organization's videos"
      >
        {canUpload && (
          <Button onClick={() => navigate("/upload")} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={processingFilter} onValueChange={setProcessingFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Processing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="analyzed">Analyzed</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Sensitivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sensitivity</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <VideoOff className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-lg font-medium">No videos found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {processingFilter !== "all" || sensitivityFilter !== "all"
              ? "Try adjusting your filters"
              : canUpload
                ? "Upload your first video to get started"
                : "No videos have been uploaded yet"}
          </p>
          {canUpload &&
            processingFilter === "all" &&
            sensitivityFilter === "all" && (
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => navigate("/upload")}
              >
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
