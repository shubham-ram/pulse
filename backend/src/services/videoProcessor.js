import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";
import Video from "../models/Video.js";
import { getIO } from "../config/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORIGINALS_DIR = path.join(__dirname, "../../uploads/originals");
const PROCESSED_DIR = path.join(__dirname, "../../uploads/processed");

// Transcode video to web-friendly H.264 mp4
const transcodeVideo = (inputFileName, outputFileName, userId) => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(ORIGINALS_DIR, inputFileName);
    const outputPath = path.join(PROCESSED_DIR, outputFileName);
    const io = getIO();

    let totalDuration = 0;

    ffmpeg(inputPath)
      .outputOptions([
        "-codec:v libx264",
        "-preset fast",
        "-crf 23",
        "-codec:a aac",
        "-movflags +faststart", // enables streaming before full download
      ])
      .output(outputPath)
      .on("codecData", (data) => {
        // Parse total duration for progress calculation
        const parts = data.duration.split(":");
        totalDuration =
          parseFloat(parts[0]) * 3600 +
          parseFloat(parts[1]) * 60 +
          parseFloat(parts[2]);
      })
      .on("progress", (progress) => {
        let percent = 0;
        if (progress.timemark) {
          const parts = progress.timemark.split(":");
          const currentTime =
            parseFloat(parts[0]) * 3600 +
            parseFloat(parts[1]) * 60 +
            parseFloat(parts[2]);
          percent =
            totalDuration > 0
              ? Math.min(Math.round((currentTime / totalDuration) * 100), 100)
              : 0;
        }
        io.to(userId).emit("processing-progress", {
          stage: "transcoding",
          progress: percent,
        });
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};

// Extract video duration using ffprobe
const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
};

// Simulated sensitivity analysis
const analyzeSensitivity = (userId) => {
  return new Promise((resolve) => {
    const io = getIO();
    const steps = [10, 30, 50, 70, 90, 100];
    let stepIndex = 0;

    const interval = setInterval(() => {
      io.to(userId).emit("processing-progress", {
        stage: "analyzing",
        progress: steps[stepIndex],
      });
      stepIndex++;

      if (stepIndex >= steps.length) {
        clearInterval(interval);
        // Randomly classify as safe or flagged (80% safe, 20% flagged)
        const result = Math.random() < 0.8 ? "safe" : "flagged";
        resolve(result);
      }
    }, 500);
  });
};

// Full processing pipeline
export const processVideo = async (videoId, userId) => {
  const io = getIO();

  try {
    // Update status to processing
    const video = await Video.findById(videoId);
    if (!video) return;

    video.processingStatus = "processing";
    await video.save();

    io.to(userId).emit("processing-progress", {
      stage: "starting",
      progress: 0,
    });

    // Step 1: Transcode video
    const inputFileName = path.basename(video.fileUrl);
    const outputFileName = `processed_${inputFileName}`;

    const outputPath = await transcodeVideo(
      inputFileName,
      outputFileName,
      userId
    );

    video.streamUrl = `/uploads/processed/${outputFileName}`;

    // Step 2: Extract duration
    const duration = await getVideoDuration(outputPath);
    video.duration = Math.round(duration);

    io.to(userId).emit("processing-progress", {
      stage: "transcoding-complete",
      progress: 100,
    });

    // Step 3: Sensitivity analysis
    video.processingStatus = "analyzed";
    const sensitivityResult = await analyzeSensitivity(userId);
    video.sensitivityStatus = sensitivityResult;

    // Step 4: Mark as ready
    video.processingStatus = "ready";
    await video.save();

    io.to(userId).emit("processing-complete", {
      videoId: video._id,
      processingStatus: "ready",
      sensitivityStatus: sensitivityResult,
      streamUrl: video.streamUrl,
      duration: video.duration,
    });
  } catch (error) {
    console.error("Video processing failed:", error.message);

    await Video.findByIdAndUpdate(videoId, {
      processingStatus: "failed",
    });

    io.to(userId).emit("processing-error", {
      videoId,
      message: "Video processing failed",
    });
  }
};
