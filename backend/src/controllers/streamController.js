import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Video from "../models/Video.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// GET /api/videos/:id/stream
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
      status: "active",
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.processingStatus !== "ready") {
      return res.status(422).json({
        success: false,
        message: "Video is not ready for streaming",
      });
    }

    // Resolve the processed file on disk
    // streamUrl is like /uploads/processed/processed_abc123.mp4
    const filePath = path.join(UPLOADS_DIR, video.streamUrl.replace("/uploads", ""));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Video file not found on disk",
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header: "bytes=start-end"
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      stream.pipe(res);
    } else {
      // No Range header — send the entire file
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
