import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await query(
      `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.must_change_password, u.last_login_at, u.created_at, r.name as role_name
       FROM admin_users u
       JOIN admin_roles r ON u.role_id = r.id
       ORDER BY u.created_at ASC`
    );

    const roles = await query('SELECT * FROM admin_roles ORDER BY id ASC');

    return res.status(200).json({
      success: true,
      data: {
        users,
        roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required.',
      });
    }

    // Check duplicate email
    const existing = await query('SELECT id FROM admin_users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An administrator with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO admin_users (name, email, password_hash, role_id, is_active, must_change_password)
       VALUES (?, ?, ?, ?, 1, 1)`,
      [name.trim(), email.trim().toLowerCase(), passwordHash, roleId]
    );

    return res.status(201).json({
      success: true,
      message: 'Administrator account created successfully.',
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, roleId, isActive, password } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name.trim());
    }

    if (roleId) {
      updates.push('role_id = ?');
      params.push(roleId);
    }

    if (isActive !== undefined) {
      // Prevent deactivating own account
      if (parseInt(id, 10) === req.user.id && !isActive) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own administrative account.',
        });
      }
      updates.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (password && password.trim()) {
      const passwordHash = await bcrypt.hash(password.trim(), 12);
      updates.push('password_hash = ?');
      params.push(passwordHash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update.' });
    }

    params.push(id);
    await query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    await query('DELETE FROM admin_users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Administrator removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
