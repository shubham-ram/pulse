import Video from "../models/Video.js";

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

    if (!video.streamUrl) {
      return res.status(404).json({
        success: false,
        message: "Video stream URL not available",
      });
    }

    // Redirect to the Cloudinary URL for streaming
    res.redirect(video.streamUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
