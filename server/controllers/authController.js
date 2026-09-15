import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user in database
    const users = await query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role_id, u.is_active, u.must_change_password, r.name as role_name
       FROM admin_users u
       JOIN admin_roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email.trim().toLowerCase()]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Contact a Super Administrator.',
      });
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    // Update last_login_at
    await query('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'onecore_pharma_jwt_secure_key_2026_super_secret_token';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name,
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.role_id,
          roleName: user.role_name,
          mustChangePassword: !!user.must_change_password,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated.',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        roleId: req.user.role_id,
        roleName: req.user.role_name,
        mustChangePassword: !!req.user.must_change_password,
      },
    },
  });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const users = await query('SELECT password_hash FROM admin_users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const match = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await query(
      'UPDATE admin_users SET password_hash = ?, must_change_password = 0 WHERE id = ?',
      [newHash, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
