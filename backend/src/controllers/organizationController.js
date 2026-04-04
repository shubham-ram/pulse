import Organization from '../models/Organization.js';
import User from '../models/User.js';

// POST /api/organizations/create
export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an organization name',
      });
    }

    // Check if user is already in an org
    if (req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of an organization',
      });
    }

    // Check if org name already exists
    const existingOrg = await Organization.findOne({ name, status: 'active' });
    if (existingOrg) {
      return res.status(409).json({
        success: false,
        message: 'Organization with this name already exists',
      });
    }

    // Create org with current user as creator and first member
    const organization = await Organization.create({
      name,
      description: description || '',
      createdBy: req.user._id,
      memberIds: [req.user._id],
    });

    // Update user with org and admin role
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: { organization },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/organizations/join
export const joinOrganization = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an invite code',
      });
    }

    // Check if user is already in an org
    if (req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of an organization',
      });
    }

    // Find org by invite code
    const organization = await Organization.findOne({ inviteCode, status: 'active' });
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code',
      });
    }

    // Add user to org members
    organization.memberIds.push(req.user._id);
    await organization.save();

    // Update user with org and default viewer role
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id,
      role: 'viewer',
    });

    res.status(200).json({
      success: true,
      message: 'Joined organization successfully',
      data: { organization },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/organizations/me
export const getMyOrganization = async (req, res) => {
  try {
    if (!req.user.organizationId) {
      return res.status(200).json({
        success: true,
        data: { organization: null },
      });
    }

    const organization = await Organization.findOne({
      _id: req.user.organizationId,
      status: 'active',
    }).populate('memberIds', 'name email role status');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { organization },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
