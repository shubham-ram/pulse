import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import PageHeader from "@/components/layout/PageHeader";
import VideoCard from "@/components/video/VideoCard";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Upload, Video } from "lucide-react";
import StatCards from "./components/StatCards";
import StatusFilter from "./components/StatusFilter";
import SensitivityFilter from "./components/SensitivityFilter";

const processingMap = {
  "All statuses": "all",
  Processing: "processing",
  Analyzed: "analyzed",
  Ready: "ready",
  Failed: "failed",
};

const sensitivityMap = {
  "All sensitivity": "all",
  Pending: "pending",
  Safe: "safe",
  Flagged: "flagged",
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingFilter, setProcessingFilter] = useState("All statuses");
  const [sensitivityFilter, setSensitivityFilter] = useState("All sensitivity");

  const canUpload = user?.role === "admin" || user?.role === "editor";

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const mappedProcessing = processingMap[processingFilter];
      const mappedSensitivity = sensitivityMap[sensitivityFilter];

      const params = {};
      if (mappedProcessing && mappedProcessing !== "all") {
        params.processingStatus = mappedProcessing;
      }
      if (mappedSensitivity && mappedSensitivity !== "all") {
        params.sensitivityStatus = mappedSensitivity;
      }

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

      {/* Stat Cards */}
      <StatCards videos={videos} />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-6 rounded-lg bg-muted/40 p-3 px-4 border">
        <div className="flex items-center gap-3">
          <StatusFilter
            processingFilter={processingFilter}
            setProcessingFilter={setProcessingFilter}
          />
        </div>

        <div className="flex items-center gap-3">
          <SensitivityFilter
            sensitivityFilter={sensitivityFilter}
            setSensitivityFilter={setSensitivityFilter}
          />
        </div>
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-20 px-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform duration-500 hover:scale-110">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No videos found</h3>
          <p className="max-w-md mt-2 text-sm text-muted-foreground">
            {processingFilter !== "All statuses" ||
            sensitivityFilter !== "All sensitivity"
              ? "We couldn't find any videos matching your current filter criteria. Try clearing them to see all videos."
              : canUpload
                ? "Start building your organization's video library by uploading your first piece of content."
                : "Your organization hasn't uploaded any videos yet."}
          </p>
          {canUpload &&
            processingFilter === "All statuses" &&
            sensitivityFilter === "All sensitivity" && (
              <Button
                size="lg"
                className="mt-8 gap-2 font-medium"
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
