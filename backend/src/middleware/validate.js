import { body, param, validationResult } from 'express-validator';

/**
 * Middleware that checks express-validator results and returns
 * a 400 response with all error messages if validation failed.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
    });
  }
  next();
};

// --- Auth validations ---

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidation,
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// --- Organization validations ---

export const validateCreateOrg = [
  body('name').trim().notEmpty().withMessage('Organization name is required'),
  handleValidation,
];

export const validateJoinOrg = [
  body('inviteCode').trim().notEmpty().withMessage('Invite code is required'),
  handleValidation,
];

export const validateUpdateRole = [
  param('id').isMongoId().withMessage('Invalid member ID'),
  body('role')
    .isIn(['admin', 'editor', 'viewer'])
    .withMessage('Role must be admin, editor, or viewer'),
  handleValidation,
];

export const validateMemberId = [
  param('id').isMongoId().withMessage('Invalid member ID'),
  handleValidation,
];

// --- Video validations ---

export const validateUploadVideo = [
  body('title').trim().notEmpty().withMessage('Video title is required'),
  handleValidation,
];

export const validateVideoId = [
  param('id').isMongoId().withMessage('Invalid video ID'),
  handleValidation,
];
