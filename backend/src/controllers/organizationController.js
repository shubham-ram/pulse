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

// GET /api/organizations/members — list all members (admin only)
export const getMembers = async (req, res) => {
  try {
    const members = await User.find({
      organizationId: req.user.organizationId,
      status: 'active',
    }).select('name email role createdAt');

    res.status(200).json({
      success: true,
      data: { members },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/organizations/members/:id/role — change a member's role (admin only)
export const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid role (admin, editor, viewer)',
      });
    }

    // Can't change your own role
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const member = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
      status: 'active',
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in your organization',
      });
    }

    member.role = role;
    await member.save();

    res.status(200).json({
      success: true,
      message: `Member role updated to '${role}'`,
      data: {
        member: {
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/organizations/members/:id — remove a member (admin only)
export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Can't remove yourself
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove yourself from the organization',
      });
    }

    const member = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
      status: 'active',
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in your organization',
      });
    }

    // Remove org and role from user
    member.organizationId = null;
    member.role = null;
    await member.save();

    // Remove from org's memberIds
    await Organization.findByIdAndUpdate(req.user.organizationId, {
      $pull: { memberIds: member._id },
    });

    res.status(200).json({
      success: true,
      message: 'Member removed from organization',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
