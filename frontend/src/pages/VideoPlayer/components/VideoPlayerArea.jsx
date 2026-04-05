import { Loader2, AlertCircle } from "lucide-react";

const VideoPlayerArea = ({ video, streamUrl }) => {
  const isReady = video.processingStatus === "ready";

  return (
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
  );
};

export default VideoPlayerArea;
