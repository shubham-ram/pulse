import { Router } from 'express';
import { uploadVideo, getVideos, getVideoById, deleteVideo } from '../controllers/videoController.js';
import { streamVideo } from '../controllers/streamController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = Router();

// Editor/Admin can upload
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('video'), uploadVideo);

// All org members can view
router.get('/', protect, authorize('admin', 'editor', 'viewer'), getVideos);

// Stream processed video (must be before /:id to avoid param conflict)
router.get('/:id/stream', protect, authorize('admin', 'editor', 'viewer'), streamVideo);

router.get('/:id', protect, authorize('admin', 'editor', 'viewer'), getVideoById);

// Editor (own videos) / Admin (any) can delete
router.delete('/:id', protect, authorize('admin', 'editor'), deleteVideo);

export default router;
