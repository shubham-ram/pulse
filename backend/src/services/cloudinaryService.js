import cloudinary from '../config/cloudinary.js';

/**
 * Upload a video file to Cloudinary.
 * @param {string} filePath - Local path to the file
 * @param {object} options - Upload options
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = (filePath, options = {}) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    folder: 'pulse/videos',
    ...options,
  });
};

/**
 * Delete a resource from Cloudinary by public_id.
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>}
 */
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
};
