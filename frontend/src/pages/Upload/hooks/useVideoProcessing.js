import { useState, useEffect } from "react";
import socket from "@/services/socket";
import { toast } from "sonner";

function useVideoProcessing(userId) {
  const [processingState, setProcessingState] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) return;

    socket.connect();
    socket.emit("join", userId);

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
  }, [listening, userId]);

  const startListening = () => {
    setProcessingState({ stage: "starting", progress: 0 });
    setListening(true);
  };

  const resetProcessing = () => {
    setProcessingState(null);
    setProcessingResult(null);
  };

  return {
    processingState,
    processingResult,
    startListening,
    resetProcessing,
  };
}

export default useVideoProcessing;
