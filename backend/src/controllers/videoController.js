import Video from "../models/Video.js";
import "../models/User.js";
import "../models/Category.js";

// POST /api/videos/upload
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a video file",
      });
    }

    const { title, description, categoryIds } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please provide a video title",
      });
    }

    const video = await Video.create({
      title,
      description: description || "",
      originalFileName: req.file.originalname,
      fileUrl: `/uploads/originals/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      categoryIds: categoryIds ? JSON.parse(categoryIds) : [],
      uploadedBy: req.user._id,
      organizationId: req.user.organizationId,
      processingStatus: "uploading",
      sensitivityStatus: "pending",
    });

    // TODO: Phase 6 — trigger video processing pipeline here

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: { video },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/videos
export const getVideos = async (req, res) => {
  try {
    const { processingStatus, sensitivityStatus, categoryId } = req.query;

    const filter = {
      organizationId: req.user.organizationId,
      status: "active",
    };

    if (processingStatus) filter.processingStatus = processingStatus;
    if (sensitivityStatus) filter.sensitivityStatus = sensitivityStatus;
    if (categoryId) filter.categoryIds = categoryId;

    const videos = await Video.find(filter)
      .populate("uploadedBy", "name email")
      .populate("categoryIds", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { videos, count: videos.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
      status: "active",
    })
      .populate("uploadedBy", "name email")
      .populate("categoryIds", "name");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { video },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/videos/:id (soft delete)
export const deleteVideo = async (req, res) => {
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

    // Editors can only delete their own videos, admins can delete any
    if (
      req.user.role === "editor" &&
      video.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own videos",
      });
    }

    video.status = "inactive";
    await video.save();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
