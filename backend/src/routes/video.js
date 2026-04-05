import { Router } from 'express';
import { uploadVideo, getVideos, getVideoById, deleteVideo } from '../controllers/videoController.js';
import { streamVideo } from '../controllers/streamController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateUploadVideo, validateVideoId } from '../middleware/validate.js';
import upload from '../config/multer.js';

const router = Router();

// Editor/Admin can upload
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('video'), validateUploadVideo, uploadVideo);

// All org members can view
router.get('/', protect, authorize('admin', 'editor', 'viewer'), getVideos);

// Stream processed video (must be before /:id to avoid param conflict)
router.get('/:id/stream', protect, authorize('admin', 'editor', 'viewer'), validateVideoId, streamVideo);

router.get('/:id', protect, authorize('admin', 'editor', 'viewer'), validateVideoId, getVideoById);

// Editor (own videos) / Admin (any) can delete
router.delete('/:id', protect, authorize('admin', 'editor'), validateVideoId, deleteVideo);

export default router;
